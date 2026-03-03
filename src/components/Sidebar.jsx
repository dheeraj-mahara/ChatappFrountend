import { NavLink } from "react-router-dom";
import { FaRocketchat, FaCircle, FaPlus, FaUser } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";

export default function Sidebar() {
  return (
    <div className="flex flex-row justify-around  gap-5 p-1 md:justify-start md:flex-col md:pt-5 h-full items-center text-sm text-gray-700 bg-[#f0f0f0]"> 
         <NavLink to="/">
      <button className=" pt-[3px] flex flex-col items-center hover:text-blue-500 transition">
        <FaRocketchat size={20} />
        <span className="text-[11px]">Chats</span>
      </button>
    </NavLink>

      <NavLink to="/status">
        <button className=" pt-[3px] flex flex-col items-center hover:text-blue-500 transition">
          <FaCircle size={20} />
          <span className="text-[11px]"> Status</span>
        </button>
      </NavLink>

      <NavLink to="/post">
        <button className=" pt-[3px] flex flex-col items-center hover:text-blue-500 transition">
          <FaPlus size={20} />
          <span className="text-[11px]">Post</span>
        </button>
      </NavLink>

      <NavLink to="/call">
        <button className=" pt-[3px] flex flex-col items-center hover:text-blue-500 transition">
          <IoIosCall size={20} />
          <span className="text-[11px]">Calls</span>
        </button>
      </NavLink>

      <NavLink to="/profile">
        <button className=" pt-[3px] flex flex-col items-center hover:text-blue-500 transition">
          <FaUser size={20} />
          <span className="text-[11px] ">Profile</span>
        </button>
      </NavLink>

    </div>
  );
}