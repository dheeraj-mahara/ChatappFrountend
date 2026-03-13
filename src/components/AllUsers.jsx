import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function AllUsers({ allusers = [] }) {

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return allusers.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.contact?.toLowerCase().includes(query)
    );

  }, [search, allusers]);

  const handleClick = (id) => {
    navigate(`/chat/${id}`);
  }

  return (
    <div className="h-screen bg-white p-4 flex flex-col">

     <div className="flex items-center gap-4 pb-3 px-2 border-b border-gray-100 ">
  <button
    onClick={() => navigate("/")}
    className="group flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:text-blue-600 active:scale-90"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
      className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  </button>

  <div>
    <h2 className="text-lg font-semibold tracking-tight text-gray-900">
      Start New Chat
    </h2>
  </div>
</div>

      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 rounded-lg border mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => handleClick(user.id)}
              className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer flex gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.contact}</p>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10">
            No users found
          </div>
        )}
      </div>

    </div>
  );
}