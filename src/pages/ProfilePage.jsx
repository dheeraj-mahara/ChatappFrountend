import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, ShieldCheck, Camera, LogOut, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [updating, setUpdating] = useState(false);
  const hasChanged =
    name !== currentUser?.name ||
    about !== currentUser?.about ||
    image !== null;

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

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setAbout(currentUser.about || "");
    }
  }, [currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleLogout = async () => {
    try {
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


  const handleUpdate = async () => {
    try {
      setUpdating(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("about", about);
      if (image) formData.append("image", image);

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      if (res.data.success) {
        toast.success("Profile updated!");
        setCurrentUser(res.data.user);
        setIsEditing(false);
        setPreview(null);
        setImage(null);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Update failed";

      toast.error(message);
    } finally {
      setUpdating(false);
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

        <div className={`relative mb-6 `}>
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center">

            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : currentUser?.image ? (
              <img
                src={currentUser.image}
                alt="User Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={64} className="text-gray-400" />
            )}

          </div>

          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition"
              >
                <Camera size={20} />
              </button>
            </>
          )}
        </div>


        <div className="w-full max-w-md space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <User size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Full Name</p>
              {isEditing ? (
                <input

                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xl font-semibold w-full outline-none"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-800">
                  {currentUser?.name}
                </p>
              )}
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
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">About</p>

              <div className="p-3 rounded-xl">


                {isEditing ? (
                  <input
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Write about..."
                    className="text-lg font-semibold text-gray-800 w-full outline-none"
                  />
                ) : (
                  <p className="text-sm font-semibold ">
                    {currentUser?.about || "Not mentioned"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-4 p-4 bg-blue-600 text-white rounded-2xl font-bold"
            >
              Edit Profile
            </button>
          )}

          {isEditing && hasChanged && (
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="w-full mt-4 p-4 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {updating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          )}

          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                setName(currentUser?.name || "");
                setAbout(currentUser?.about || "");
                setPreview(null);
                setImage(null);
              }}
              className="w-full mt-2 p-4 bg-gray-200 rounded-2xl font-bold"
            >
              Cancel
            </button>
          )}


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