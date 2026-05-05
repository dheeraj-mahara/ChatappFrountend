import { useEffect, useRef, useState, useCallback } from "react";
import socket from "../socket";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export function useWebRTC(callState, currentUser) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const isSetupDone = useRef(false); // ✅ double setup rokne ke liye

  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);

  const getUserId = (u) => u?._id || u?.id || u?.userid;
  const toUserId = getUserId(callState.user);

  // ── Video element mount hone par stream assign karo ──
  const setRemoteRef = useCallback((node) => {
    remoteVideoRef.current = node;
    if (node && remoteStreamRef.current) {
      node.srcObject = remoteStreamRef.current;
    }
  }, []);

  const setLocalRef = useCallback((node) => {
    localVideoRef.current = node;
    if (node && localStreamRef.current) {
      node.srcObject = localStreamRef.current;
    }
  }, []);

  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: callState.type === "video",
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    return stream;
  };

  const createPeer = (stream) => {
    // ✅ Pehle wala band karo
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    pc.ontrack = (e) => {
      console.log("ontrack ✅", e.streams[0]);
      const stream = e.streams[0];
      remoteStreamRef.current = stream;

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      setRemoteReady(true);
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", { to: toUserId, candidate: e.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("PC state:", pc.connectionState);
    };

    return pc;
  };

  const stopCall = () => {
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    isSetupDone.current = false;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    setRemoteReady(false);
  };

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsMuted((p) => !p);
  };

  const toggleCam = () => {
    localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsCamOff((p) => !p);
  };

  // ✅ Sirf EK baar sab setup karo
  useEffect(() => {
    if (callState.mode !== "ongoing") {
      if (callState.mode === "idle") stopCall();
      return;
    }

    // ✅ Agar already setup ho chuka hai to dobara mat karo
    if (isSetupDone.current) return;
    isSetupDone.current = true;

    const isCaller = callState.initiator === true;

    // ── Offer/Answer handlers ──
    const onOffer = async ({ offer }) => {
      console.log("Offer received ✅");
      try {
        const stream = await getMedia();
        const pc = createPeer(stream);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc-answer", { to: toUserId, answer });
        console.log("Answer sent ✅");
      } catch (err) {
        console.error("onOffer error:", err);
      }
    };

    const onAnswer = async ({ answer }) => {
      console.log("Answer received ✅");
      try {
        const pc = pcRef.current;
        if (!pc) return;
        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          console.log("Remote set ✅");
        }
      } catch (err) {
        console.error("onAnswer error:", err);
      }
    };

    const onIce = async ({ candidate }) => {
      try {
        if (pcRef.current && candidate) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (_) {}
    };

    // ✅ Pehle listeners lagao, phir offer bhejo
    socket.on("webrtc-offer", onOffer);
    socket.on("webrtc-answer", onAnswer);
    socket.on("ice-candidate", onIce);

    if (isCaller) {
      (async () => {
        try {
          const stream = await getMedia();
          const pc = createPeer(stream);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("webrtc-offer", { to: toUserId, offer });
          console.log("Offer sent ✅");
        } catch (err) {
          console.error("Caller error:", err);
        }
      })();
    }

    return () => {
      socket.off("webrtc-offer", onOffer);
      socket.off("webrtc-answer", onAnswer);
      socket.off("ice-candidate", onIce);
    };

  }, [callState.mode]); // ✅ sirf mode change par

  return {
    setLocalRef,   // ← ref callback
    setRemoteRef,  // ← ref callback
    isMuted,
    isCamOff,
    remoteReady,
    toggleMute,
    toggleCam,
    stopCall,
  };
}