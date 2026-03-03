import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, ShieldCheck, Camera, LogOut, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const initChat = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setCurrentUser(res.data.currentUser);
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


  const handleLogout = async () => {
  try {
    // Backend API call to clear cookies
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`, 
      {}, 
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success("Logged out successfully!");
      setCurrentUser(null);
      navigate("/login");
    }
  } catch (err) {
    console.error("Logout error:", err);
    toast.error("Failed to logout. Try again.");
  }
};

  if (loading) return <div className="h-full flex items-center justify-center">Loading...</div>;

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className=" p-2 text-black flex items-center gap-4 shadow-md">
        <button onClick={() => navigate("/")} className="hover:bg-blue-700 p-2 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold ">Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center">
        {/* Profile Avatar Section */}
        <div className="relative mb-6 opacity-[.4]">
          <div className="w-32 h-32  rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            {currentUser?.image ? (
              <img src={currentUser.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={64} className="text-gray-400" />
            )}
          </div>
          <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-full border-4 border-white shadow-md hover:bg-blue-700 transition-transform active:scale-90">
            <Camera size={20} />
          </button>
        </div>

        {/* Info Cards */}
        <div className="w-full max-w-md space-y-4">
          {/* Name Card */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <User size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Full Name</p>
              <p className="text-lg font-semibold text-gray-800">{currentUser?.name || "N/A"}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <Phone size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone Number</p>
              <p className="text-lg font-semibold text-gray-800">+{currentUser?.contact || "N/A"}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Status</p>

              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <p className="font-semibold text-gray-800">Active Now</p>
              </div>
            </div>
          </div>

       <button 
  onClick={handleLogout}
  className="w-full mt-8 flex items-center justify-center gap-2 p-4 text-red-600 font-bold bg-red-50 hover:bg-red-100 rounded-2xl transition-colors active:scale-[0.98]"
>
  <LogOut size={20} />
  Logout from Device
</button>
        </div>

        <p className="mt-8 text-gray-400 text-sm">User ID: {currentUser?.id}</p>
      </div>
    </div>
  );
}