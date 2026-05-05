import { useEffect, useRef, useState } from "react";
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
  const remoteStreamRef = useRef(null); // ✅ remote stream ref
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [remoteReady, setRemoteReady] = useState(false); // ✅ trigger re-render

  const getUserId = (u) => u?._id || u?.id || u?.userid;

  const getMedia = async (type) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === "video",
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    return stream;
  };

  const createPeer = (stream, toUserId) => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // ✅ Remote stream aate hi ref mein store karo + state update karo
    pc.ontrack = (e) => {
      console.log("ontrack fired ✅", e.streams);
      const remoteStream = e.streams[0];
      remoteStreamRef.current = remoteStream;

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }

      setRemoteReady(true); // re-render trigger
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: toUserId,
          candidate: e.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
    };

    return pc;
  };

  useEffect(() => {
    if (remoteStreamRef.current && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [remoteReady]);

  const stopCall = () => {
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
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMuted((p) => !p);
  };

  const toggleCam = () => {
    localStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsCamOff((p) => !p);
  };

  useEffect(() => {
    if (callState.mode !== "ongoing") {
      if (callState.mode === "idle") stopCall();
      return;
    }

    if (!callState.initiator) return;

    const toUserId = getUserId(callState.user);

    (async () => {
      try {
        const stream = await getMedia(callState.type);
        const pc = createPeer(stream, toUserId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("webrtc-offer", { to: toUserId, offer });
        console.log("Offer sent ✅");
      } catch (err) {
        console.error("Caller error:", err);
      }
    })();
  }, [callState.mode, callState.initiator]);

  useEffect(() => {
    const toUserId = getUserId(callState.user);

    const onOffer = async ({ offer }) => {
      console.log("Offer received ✅");
      try {
        const stream = await getMedia(callState.type);
        const pc = createPeer(stream, toUserId);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("webrtc-answer", { to: toUserId, answer });
        console.log("Answer sent ✅");
      } catch (err) {
        console.error("Receiver error:", err);
      }
    };

    const onAnswer = async ({ answer }) => {
      console.log("Answer received ✅");
      try {
        const pc = pcRef.current;
        if (!pc) return;
        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          console.log("Remote description set ✅");
        }
      } catch (err) {
        console.error("Answer error:", err);
      }
    };

    const onIce = async ({ candidate }) => {
      try {
        if (pcRef.current && candidate) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {}
    };

    socket.on("webrtc-offer", onOffer);
    socket.on("webrtc-answer", onAnswer);
    socket.on("ice-candidate", onIce);

    return () => {
      socket.off("webrtc-offer", onOffer);
      socket.off("webrtc-answer", onAnswer);
      socket.off("ice-candidate", onIce);
    };
  }, [callState.user, callState.type]);

  return {
    localVideoRef,
    remoteVideoRef,
    isMuted,
    isCamOff,
    remoteReady,
    toggleMute,
    toggleCam,
    stopCall,
  };
}