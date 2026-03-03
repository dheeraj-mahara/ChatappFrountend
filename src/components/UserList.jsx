import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import Logoimage from "../assets/images.png";

export default function UserList({ users = [], allusers = [], currentUser }) {
  const navigate = useNavigate();
  const { receiverId } = useParams();
  const [search, setSearch] = useState("");
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const searchResults = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return [];

    return allusers.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.contact?.toLowerCase().includes(query)

    );
  }, [search, allusers]);

  return (
    <div className=" h-full bg-white border-r border-gray-100 flex flex-col shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 bg-white flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
<span>{currentUser?.name || "Loading..."}</span>
        </h1>
        <div className="h-8 text-xl opacity-70 hover:opacity-100 transition-opacity">
          <img className="h-full w-full" src={Logoimage} />
        </div>
      </div>

      {/* Search Input Area */}
      <div className="px-4 pb-4">
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-10 py-2.5 bg-gray-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {search ? (
          <div className="px-2">
            <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Search Results</p>
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <UserItem
                  key={user.id}
                  user={user}
                  onClick={() => { navigate(`/chat/${user.id}`); setSearch(""); }}
                  isSearch
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">No users match "{search}"</div>
            )}
          </div>
        ) : (
          <div className="px-2">
            <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Chats</p>

            {users.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                isActive={String(receiverId) === String(user.id)}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserItem({ user, isActive, formatTime, isSearch = false }) {
  const navigate = useNavigate();

  return (

    <div onClick={() => navigate(`/chat/${user.id}`)} className={`group flex items-center gap-4 p-3 cursor-pointer transition-all duration-200 rounded-2xl mb-1    ${isActive ? "bg-blue-50 shadow-sm" : "hover:bg-gray-50"}`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
          {user.name.charAt(0).toUpperCase()}
        </div>
        {user.online && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className={`font-semibold truncate ${isActive ? "text-blue-900" : "text-gray-800"}`}>
            {user.name}
          </p>
          {formatTime && (
            <span className="text-[11px] font-medium text-gray-400">
              {formatTime(user.updatedAt)}
            </span>
          )}
        </div>
        <p className={`text-sm truncate ${isActive ? "text-blue-600/80" : "text-gray-500"}`}>
          {isSearch ? "Tap to start chatting" : (user.lastMessage || "No messages yet")}
        </p>
      </div>

      {/* {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>} */}
    </div>
  );
}