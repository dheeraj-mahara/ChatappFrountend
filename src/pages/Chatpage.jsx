import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import UserList from "../components/UserList";
import ChatArea from "../components/ChatArea";
import Logoimage from "../assets/images.png";


export default function Chatpage() {
  const navigate = useNavigate();
  const { receiverId } = useParams();

  const [users, setUsers] = useState([]);
  const [allusers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUser, setshowUser] = useState([]);
  
  // Check if a chat is currently active
  const isChatOpen = Boolean(receiverId);
  

  const selectedUser =
  showUser.find((u) => String(u.id) === String(receiverId)) ||
  allusers.find((u) => String(u.id) === String(receiverId));

  useEffect(() => {
    const initChat = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setCurrentUser(res.data.currentUser);
          setUsers(res.data.users);
          setAllUsers(res.data.allUsers || []);
        }
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [navigate]);

  // 2. Socket Connection
  useEffect(() => {
    if (!currentUser) return;

    socket.auth = { userId: currentUser.id };
    socket.connect();



    socket.on("onlineUsers", (onlineUserIds) => {

  const updatedUsers = users.map(u => ({
    ...u,
    online: onlineUserIds.includes(u.id)
  }));

  setshowUser(updatedUsers);
});
    return () => {
      socket.off("updateUserStatus");
      socket.disconnect();
    };
  }, [currentUser]);


  // 3. Real-time User List Updates
  useEffect(() => {
    const handleUserUpdate = (data) => {
      setshowUser((prevUsers) => {
        const filtered = prevUsers.filter((u) => String(u.id) !== String(data.contactId));
        const updatedUser = {
          id: data.contactId,
          name: data.user || "User",
          lastMessage: data.lastMessage,
          updatedAt: data.updatedAt,
        };
        return [updatedUser, ...filtered];
      });
    };

    socket.on("chatUserUpdate", handleUserUpdate);
    return () => socket.off("chatUserUpdate");
  }, []);

  useEffect(() => {
    if (selectedUser && currentUser) {
      socket.emit("joinChat", { receiverId: selectedUser.id });
    }
  }, [selectedUser, currentUser]);

  if (loading) return <ChatSkeleton />;

  return (
    <div className="h-[100%] w-full flex bg-white overflow-hidden font-sans antialiased">

      <div className={`${isChatOpen ? "hidden" : "flex"} md:flex w-full md:w-[350px]  border-r border-gray-100 flex-col bg-white`}>
        <UserList
          users={showUser}
          allusers={allusers}
          currentUser={currentUser}
        />
      </div>

      <div className={`${!isChatOpen ? "hidden" : "flex"} md:flex flex-1 flex-col bg-gray-50`}>
        {selectedUser ? (
          <ChatArea
            selectedUser={selectedUser}
            currentUser={currentUser}
            onBack={() => navigate("/")}
          />
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center flex-col text-gray-400 p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
         
              <img className="h-[50%] grayscale-[1] " src={Logoimage} alt="" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Your Messages</h2>
            <p className="max-w-xs mt-2">Select a friend from the list to start a conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="h-screen flex animate-pulse bg-white">
      <div className="w-full md:w-[350px] border-r border-gray-100 p-4 space-y-4">
        <div className="h-8 bg-gray-100 rounded-lg w-1/3 mb-8"></div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              <div className="h-3 bg-gray-50 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:flex flex-1 bg-gray-50 items-center justify-center">
        <div className="text-gray-300 font-medium text-lg animate-bounce">
          Connecting to secure server...
        </div>
      </div>
    </div>
  );
}