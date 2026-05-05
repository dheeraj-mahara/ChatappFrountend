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
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-800 to-black text-white relative">

      {/* VIDEO MODE */}
      {type === "video" && mode === "ongoing" && (
        <div className="w-full h-full relative">
          {/* Remote video (full screen) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Local video (corner) */}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-20 right-4 w-32 h-24 rounded-lg border-2 border-white object-cover"
          />
        </div>
      )}

      {/* VOICE MODE ya calling state */}
      {(type === "voice" || mode !== "ongoing") && (
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
            <div className="absolute w-60 h-60 border-4 border-indigo-400 rounded-full animate-ping opacity-20"></div>
          )}
        </>
      )}

      {/* CONTROLS */}
      <div className="absolute bottom-6 flex gap-4">
        {mode === "ongoing" && (
          <>
            <button
              onClick={toggleMute}
              className="p-3 bg-gray-600 hover:bg-gray-500 rounded-full"
            >
              {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>

            {type === "video" && (
              <button
                onClick={toggleCam}
                className="p-3 bg-gray-600 hover:bg-gray-500 rounded-full"
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