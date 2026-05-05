import { useEffect, useRef, useState, useCallback } from "react";
import socket from "../socket";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

// ✅ Global flag — component re-mount se reset nahi hoga
let webrtcSetupDone = false;

export function useWebRTC(callState, currentUser) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false);

  const getUserId = (u) => u?._id || u?.id || u?.userid;
  const toUserId = getUserId(callState?.user);

  const setRemoteRef = useCallback((node) => {
    remoteVideoRef.current = node;
    if (node && remoteStreamRef.current) {
      node.srcObject = remoteStreamRef.current;
      console.log("setRemoteRef: stream assigned ✅");
    }
  }, []);

  const setLocalRef = useCallback((node) => {
    localVideoRef.current = node;
    if (node && localStreamRef.current) {
      node.srcObject = localStreamRef.current;
    }
  }, []);

  const getMedia = async () => {
    // ✅ Pehle se stream hai to reuse karo
    if (localStreamRef.current) return localStreamRef.current;

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
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    pc.ontrack = (e) => {
      const incoming = e.streams[0];
      console.log("ontrack ✅", incoming.id);

      // ✅ Already same stream hai to skip karo
      if (remoteStreamRef.current?.id === incoming.id) {
        console.log("Same stream, skip");
        return;
      }

      remoteStreamRef.current = incoming;

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = incoming;
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
    webrtcSetupDone = false; // ✅ Reset global flag
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;
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

  useEffect(() => {
    if (callState.mode !== "ongoing") {
      if (callState.mode === "idle") stopCall();
      return;
    }

    // ✅ Global flag check
    if (webrtcSetupDone) {
      console.log("Setup already done, skip");
      return;
    }
    webrtcSetupDone = true;

    const isCaller = callState.initiator === true;
    console.log("WebRTC setup start —", isCaller ? "CALLER" : "RECEIVER");

    const onOffer = async ({ offer }) => {
      // ✅ Caller ko offer nahi sunna chahiye
      if (isCaller) return;
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
      // ✅ Receiver ko answer nahi sunna chahiye
      if (!isCaller) return;
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
  }, [callState.mode]);

  return {
    setLocalRef,
    setRemoteRef,
    isMuted,
    isCamOff,
    remoteReady,
    toggleMute,
    toggleCam,
    stopCall,
  };
}