import { FaUser, FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { useWebRTC } from "../hooks/useWebRTC";
import { useAuth } from "../context/AuthContext";

export default function CallArea({ callState, onEnd, onReject }) {
  const { currentUser } = useAuth();
  const { user, mode, type } = callState;

  const {
    localVideoRef,
    remoteVideoRef,
    isMuted,
    isCamOff,
    remoteReady,
    toggleMute,
    toggleCam,
  } = useWebRTC(callState, currentUser);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a user to start call
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-800 to-black text-white relative overflow-hidden">

      {type === "video" && mode === "ongoing" ? (
        // ── VIDEO MODE ──────────────────────────────────
        <div className="w-full h-full relative bg-black">

          {/* Remote video — full screen */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Agar remote stream nahi aayi abhi */}
          {!remoteReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
              <p className="text-white text-sm">Connecting video...</p>
            </div>
          )}

          {/* Local video — corner */}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-24 right-4 w-28 h-20 rounded-xl border-2 border-white object-cover"
          />
        </div>

      ) : (
        // ── VOICE / CALLING MODE ─────────────────────────
        <>
          <div className="mb-6">
            {user.image ? (
              <img
                src={user.image}
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <div className="w-36 h-36 bg-gray-300 rounded-full flex items-center justify-center">
                <FaUser size={50} />
              </div>
            )}
          </div>

          <h2 className="text-2xl font-semibold">{user.name}</h2>

          <p className="mt-3 text-gray-300">
            {mode === "calling" && (type === "video" ? "📹 Calling..." : "📞 Calling...")}
            {mode === "incoming" && "📲 Incoming..."}
            {mode === "ongoing" && "🟢 Connected"}
          </p>

          {(mode === "calling" || mode === "incoming") && (
            <div className="absolute w-60 h-60 border-4 border-indigo-400 rounded-full animate-ping opacity-20" />
          )}
        </>
      )}

      {/* ── CONTROLS ────────────────────────────────────── */}
      <div className="absolute bottom-6 flex gap-4 z-10">
        {mode === "ongoing" && (
          <>
            <button
              onClick={toggleMute}
              className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
            >
              {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>

            {type === "video" && (
              <button
                onClick={toggleCam}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-white"
              >
                {isCamOff ? <FaVideoSlash /> : <FaVideo />}
              </button>
            )}
          </>
        )}

        <button
          onClick={() => mode === "ongoing" ? onEnd() : onReject()}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-full text-lg shadow-lg"
        >
          {mode === "ongoing" ? "End Call" : "Cancel"}
        </button>
      </div>

    </div>
  );
}