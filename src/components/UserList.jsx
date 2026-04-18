import { useNavigate, useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import Logoimage from "../assets/images.png";
import { FaUser } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { IoOpenOutline } from "react-icons/io5";
import { TiArrowBackOutline } from "react-icons/ti";



export default function UserList({ users = [], allusers = [], currentUser, handleDeleteChat, handleDeleteChatUser }) {


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

    return users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.contact?.toLowerCase().includes(query)

    );
  }, [search, users]);

  const handleUserClick = (id) => {
    navigate(`/chat/${id}`);
    setSearch("");
  };

  return (
    <div className=" relative h-full bg-white border-r border-gray-100 flex flex-col shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 bg-white flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          <span>{currentUser?.name || "Loading..."}</span>
        </h1>
        <div className="h-8 text-xl opacity-70 hover:opacity-100 transition-opacity">
          <img className="h-full w-full" src={Logoimage} />
        </div>
      </div>

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
                  onClick={() => handleUserClick(user.id)} />

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
                onClick={() => handleUserClick(user.id)}
                formatTime={formatTime}
                currentUser={currentUser}
                onDeleteChat={() => handleDeleteChat(user.id)}
                onDeleteChatUser={() => handleDeleteChatUser(user.id)}
              />
            ))}
          </div>
        )}

      </div>
      <button
        onClick={() => navigate("/chat/users")}
        className="group absolute bottom-8 right-8 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.6)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
}

function UserItem({ user, isActive, formatTime, isSearch, onClick, currentUser, onDeleteChat,
  onDeleteChatUser, }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [fullimgview, setfullimgview] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);





  useEffect(() => {
    const handlePopState = (event) => {
      const modal = event.state?.modal;

      if (modal === "user") {
        setfullimgview(null);
      } else {
        setSelectedUser(null);
        setfullimgview(null);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpen(false);
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);



  return (
    <div className={`group flex items-center gap-4 p-3 cursor-pointer transition-all duration-200 rounded-2xl mb-1    ${isActive ? "bg-blue-50 shadow-sm" : "hover:bg-gray-50"}`}>
      <div className="relative group">
        <div className="w-12 h-12 rounded-2xl p-[2px] bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">

          <div onClick={() => {
            setSelectedUser(user);
            window.history.pushState({ modal: "user" }, "");
          }}
            className="w-full h-full rounded-2xl bg-white overflow-hidden flex items-center justify-center text-gray-700 font-semibold text-lg">
            {user.image ? (
              <img
                src={user.image}
                alt="user"
                className="w-full h-full object-cover"


              />
            ) : (
              <span className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-full h-full flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {user.online && (
          <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
          </span>
        )}
      </div>

      <div onClick={onClick} className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className={`font-semibold truncate ${isActive ? "text-blue-900" : "text-gray-800"}`}>
            {user?.name === currentUser?.name ? `${user?.name} (you)` : user?.name}

          </p>

          <div className="flex flex-col">
            {formatTime && user.lastMessage !== "" && (
              <span className="text-[11px] font-medium text-gray-400">
                {formatTime(user.updatedAt)}
              </span>
            )}

          </div>
        </div>
        <div className="flex justify-between items-center group">

          <p className={`text-sm truncate ${isActive ? "text-blue-600/80" : "text-gray-500"}`}>
            {isSearch ? "Tap to start chatting" : (user.lastMessage || "No messages yet")}
          </p>

          <div className="relative">
            <h1
              onClick={(e) => {
                e.stopPropagation(); // user item click trigger na ho
                setMenuOpen(!menuOpen);
              }}
              className="font-bold text-gray-500 cursor-pointer md:opacity-0 md:group-hover:opacity-100 transition px-2"
            >
              ⋯
            </h1>



            {menuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 
               animate-in fade-in zoom-in-95 duration-150 overflow-hidden backdrop-blur-sm"
              >
                <button
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <TiArrowBackOutline className="text-gray-400 group-hover:text-gray-600 transition" />
                  Back
                </button>

                {/* Open */}
                <button
                  onClick={() => {
                    onClick();
                    setMenuOpen(false);
                  }}
                  className="group flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <IoOpenOutline className="text-gray-400 group-hover:text-gray-600 transition" />
                  Open
                </button>

                <div className="h-px bg-gray-100 my-1"></div>

                <button
                  onClick={() => {
                    onDeleteChatUser();
                    setMenuOpen(false);
                  }}
                  className="group flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                >
                  <FiTrash2 className="group-hover:scale-110 transition-transform" />
                  Delete Chat
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-2 sm:p-4">

          <div className="bg-white w-full max-w-xs sm:max-w-md md:max-w-lg rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in scale-in duration-300">

            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-3 sm:p-4 border-b bg-blue-50/80 backdrop-blur-sm">
              <div className="min-w-0">
                <h2 className="font-bold text-slate-900 text-sm sm:text-base truncate">{selectedUser.name}</h2>
                <p className=" flex gap-1 py-1 items-center text-xs sm:text-sm text-gray-600 font-medium truncate block">
                  <FaPhoneAlt />  {selectedUser.contact || "No contact info"}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  window.history.back();
                }}
                className="ml-2 p-2 rounded-full hover:bg-white text-slate-400 hover:text-red-500 transition-all shadow-sm border border-transparent hover:border-red-100"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto px-3 sm:px-4 py-3 space-y-4">

              <div className="flex justify-center">
                <div onClick={() => {
                  setfullimgview(selectedUser);
                  window.history.pushState({ modal: "image" }, "")
                }} className="relative group w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-xl overflow-hidden shadow-lg border-2 border-white">
                  {selectedUser.image ? (
                    <img
                      src={selectedUser.image}
                      alt="profile"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-5xl sm:text-6xl md:text-7xl">
                      <FaUser />
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-xl group-hover:ring-4 ring-blue-500/20 transition-all"></div>
                </div>
              </div>

              <div>
                <h3 className="text-[8px] sm:text-xs uppercase tracking-wider font-bold pl-1 mb-1">About</h3>
                <div className="bg-blue-50/40 p-2 sm:p-3 rounded-lg border border-blue-50 shadow-sm">
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                    {selectedUser.about || "This user hasn't added a bio yet."}
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="sticky bottom-0 p-2 sm:p-4 bg-white border-t flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  window.history.back();
                }}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base font-semibold shadow-md transition-colors"
              >
                Send Message
              </button>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  window.history.back();
                }}
                className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-slate-700 rounded-lg text-sm sm:text-base font-medium transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {fullimgview && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => {
            setfullimgview(null);
            window.history.back();
          }
          }
        >
          <img
            src={fullimgview.image}
            alt="full view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={() => {
              setfullimgview(null);
              window.history.back();
            }
            }
            className="absolute top-5 right-5 text-white text-2xl font-bold"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}