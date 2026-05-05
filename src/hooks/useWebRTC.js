import { useEffect, useRef, useState } from "react";
import socket from "../socket";

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export function useWebRTC(callState, currentUser) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  const getUserId = (u) => u?._id || u?.id || u?.userid;

  // ─── Media lena ───────────────────────────────────────
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

  // ─── PeerConnection banana ─────────────────────────────
  const createPeer = (stream, toUserId) => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: toUserId,
          candidate: e.candidate,
        });
      }
    };

    return pc;
  };

  const stopCall = () => {
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
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

    const toUserId = getUserId(callState.user);
    const isCaller = callState.initiator === true;

    if (isCaller) {
      (async () => {
        try {
          const stream = await getMedia(callState.type);
          const pc = createPeer(stream, toUserId);

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          socket.emit("webrtc-offer", { to: toUserId, offer });
        } catch (err) {
          console.error("Caller error:", err);
        }
      })();
    }

  }, [callState.mode, callState.initiator]);

  useEffect(() => {
    const toUserId = getUserId(callState.user);

    const onOffer = async ({ offer }) => {
      try {
        const stream = await getMedia(callState.type);
        const pc = createPeer(stream, toUserId);

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("webrtc-answer", { to: toUserId, answer });
      } catch (err) {
        console.error("Receiver offer error:", err);
      }
    };

    const onAnswer = async ({ answer }) => {
      try {
        const pc = pcRef.current;
        if (!pc) return;

        if (pc.signalingState === "have-local-offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } else {
          console.warn("setRemoteDescription skip — state:", pc.signalingState);
        }
      } catch (err) {
        console.error("Caller answer error:", err);
      }
    };

    const onIce = async ({ candidate }) => {
      try {
        const pc = pcRef.current;
        if (pc && candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
      }
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
    toggleMute,
    toggleCam,
    stopCall,
  };
}