import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";
import CallUserList from "../components/CallUserList";
import CallArea from "../components/CallArea";
import { toast } from "react-toastify";

const CALL_MODES = {
  IDLE: "idle",
  CALLING: "calling",
  INCOMING: "incoming",
  ONGOING: "ongoing",
};

export default function CallPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [mobileView, setMobileView] = React.useState("list");

  const [callState, setCallState] = React.useState({
    user: null,
    type: null,
    mode: CALL_MODES.IDLE,
  });

  const callStateRef = useRef(callState);
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  const getUserId = (u) => u?._id || u?.id || u?.userid;

  useEffect(() => {
    if (location.state) {
      setCallState(location.state);
      setMobileView("call");
    }
  }, [location.state]);

  const initChat = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const filtered = res.data.users.filter(
          (u) => u.id !== currentUser?.userid
        );
        setUsers(filtered);
      }
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) initChat();
  }, [currentUser]);

  const handleEnd = () => {
    const user = callStateRef.current?.user;
    const userId = getUserId(user);
    if (userId) {
      socket.emit("call-ended", { to: userId });
    }
    setCallState({ user: null, type: null, mode: CALL_MODES.IDLE });
    setMobileView("list");
  };

  const handleReject = () => {
    const user = callStateRef.current?.user;
    const userId = getUserId(user);
    if (userId) {
      socket.emit("call-rejected", { to: userId });
    }
    setCallState({ user: null, type: null, mode: CALL_MODES.IDLE });
    setMobileView("list");
  };

 const handleCall = (user, type) => {
  setCallState({ user, type, mode: CALL_MODES.CALLING, initiator: true }); // ← initiator add
  setMobileView("call");
  socket.emit("call-user", {
    to: getUserId(user),
    from: currentUser.userid,
    type,
  });
};

  // ✅ Sirf EK useEffect — sab listeners yahan
  useEffect(() => {
    const onAccepted = () => {
      setCallState((prev) => ({ ...prev, mode: CALL_MODES.ONGOING }));
      setMobileView("call");
    };
    const onRejected = () => {
      toast.error("Call rejected");
      setCallState({ user: null, type: null, mode: CALL_MODES.IDLE });
      setMobileView("list");
    };
    const onEnded = () => {
      setCallState({ user: null, type: null, mode: CALL_MODES.IDLE });
      setMobileView("list");
    };
    const onFailed = (data) => {
      toast.error(data.message);
      setCallState({ user: null, type: null, mode: CALL_MODES.IDLE });
      setMobileView("list");
    };

    socket.on("call-accepted", onAccepted);
    socket.on("call-rejected", onRejected);
    socket.on("call-ended", onEnded);
    socket.on("call-failed", onFailed);

    return () => {
      socket.off("call-accepted", onAccepted);
      socket.off("call-rejected", onRejected);
      socket.off("call-ended", onEnded);
      socket.off("call-failed", onFailed);
    };
  }, []);

  // ✅ 30s timeout — caller aur receiver dono ke liye
  useEffect(() => {
    if (
      callState.mode === CALL_MODES.CALLING ||
      callState.mode === CALL_MODES.INCOMING
    ) {
      const timer = setTimeout(() => {
        toast.info("Call timed out");
        handleEnd();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [callState.mode]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-screen">
      <div className="md:hidden h-full">
        {mobileView === "list" ? (
          <CallUserList users={users} onCall={handleCall} />
        ) : (
          <CallArea
            callState={callState}
            onEnd={handleEnd}
            onReject={handleReject}
          />
        )}
      </div>
      <div className="hidden md:flex h-full">
        <div className="w-1/3 border-r">
          <CallUserList users={users} onCall={handleCall} />
        </div>
        <div className="flex-1">
          <CallArea
            callState={callState}
            onEnd={handleEnd}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
}