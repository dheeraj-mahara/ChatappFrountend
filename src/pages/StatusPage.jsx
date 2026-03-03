import { useEffect, useState } from "react";
import StatusList from "../components/StatusList";
import StatusViewer from "../components/StatusViewer";
import axios from "axios";
import toast from "react-hot-toast";

export default function StatusPage() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statuses, setStatuses] = useState([])

  const getallststus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/status/all`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const formattedStatuses = res.data.statuses.map((userGroup) => {
          const latestStatus = userGroup.statuses[0];


          return {
            id: userGroup.userId,
            name: userGroup.userName,
            image: latestStatus.image
              ? latestStatus.image
              : latestStatus.text
                ? `https://placehold.jp/24/3d5afe/ffffff/150x150.png?text=${encodeURIComponent(latestStatus.text.substring(0, 20))}`
                : `https://ui-avatars.com/api/?name=${userGroup.userName}&background=random`,
            time: new Date(latestStatus.expireAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            stories: userGroup.statuses,
            isUser: false,
            viewed: false,
          };
        },[]);


        setStatuses(formattedStatuses);
        
      }
    } catch (err) {
      console.error("adding status error:", err);
    }
  };

  useEffect(() => {
    getallststus();
  }, [getallststus]);


  const handleAddStatusBackend = async (statusData) => {
    if (!statusData.file && !statusData.caption) {
      return toast.error("Please add an image or some text!");
    }

    const formData = new FormData();
    formData.append("text", statusData.caption || "");
    formData.append("image", statusData.file);

    setIsUploading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/status/add`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast.success("Status posted successfully! ");
        getallststus();
        return true
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      toast.error("Failed to post status");
    } finally {
      setIsUploading(false);
    }
  };



  const handleSelectStatus = (id) => {
    const index = statuses.findIndex((s) => s.id === id);
    if (index === -1) return;

    setStatuses(prev => prev.map(s => s.id === id ? { ...s, viewed: true } : s));
    setSelectedIndex(index);

  };

  
  const handleNextUser = () => {
    if (selectedIndex !== null && selectedIndex < statuses.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      const nextId = statuses[nextIndex].id;
      setStatuses(prev => prev.map(s => s.id === nextId ? { ...s, viewed: true } : s));
    } else {
      setSelectedIndex(null);
    }
  };

  return (
    <div className="h-[100%] w-full flex bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar - List */}
      <div className={`${selectedIndex !== null ? "hidden" : "flex"} md:flex w-full md:w-[350px] border-r bg-white shadow-lg`}>

        <StatusList
          statuses={statuses}
          onSelect={(item) => handleSelectStatus(item.id)}
          onAddStatus={handleAddStatusBackend}
          loading={isUploading}
        />
      </div>

      <div className={`${selectedIndex === null ? "hidden" : "flex"} md:flex flex-1 items-center justify-center bg-[#1a1a1a]`}>
        {selectedIndex !== null && statuses[selectedIndex] ? (
          <StatusViewer
            status={statuses[selectedIndex]}
            onClose={() => setSelectedIndex(null)}
            onNextUser={handleNextUser}
          />
        ) : (
          <div className="hidden md:flex flex-col items-center text-gray-500">
            <div className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📸</span>
            </div>
            <p className="text-lg">Click on a status to view</p>
          </div>
        )}
      </div>
    </div>
  );
}