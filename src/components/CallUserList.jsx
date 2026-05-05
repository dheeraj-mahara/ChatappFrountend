import React from "react";
import { FaPhone, FaUser, FaVideo } from "react-icons/fa";

export default function CallUserList({ users = [], onCall }) {
  return (
    <div className="h-full bg-white p-4 overflow-y-auto">


      <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Start a Call
      </h1>

      <div className="space-y-2">
        {users.map((u) => (
          <div
            key={u._id || u.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition"
          >

            {/* LEFT: avatar + name */}
            <div className="flex items-center gap-3 min-w-0 flex-1">

              {u.image ? (
                <img
                  src={u.image}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full flex-shrink-0">
                  <FaUser />
                </div>
              )}

              <p
                className="truncate text-sm font-medium"
                title={u.name}
              >
                {u.name}
              </p>
            </div>

            {/* RIGHT: buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onCall(u, "voice")}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              >
                <FaPhone />
              </button>

              <button
                onClick={() => onCall(u, "video")}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              >
                <FaVideo />
              </button>
            </div>

          </div>
        ))}
      </div>

      {users.length === 0 && (
        <p className="text-center mt-10 text-gray-400">
          No users found
        </p>
      )}
    </div>
  );
}