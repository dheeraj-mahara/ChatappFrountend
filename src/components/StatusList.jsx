import { useState, useEffect } from "react";
import { Plus, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import Logoimage from "../assets/images.png";


export default function StatusList({ statuses, onSelect, onAddStatus, loading }) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newStatus, setNewStatus] = useState({ image: null, preview: "", caption: "" });

  useEffect(() => {
    return () => {
      if (newStatus.preview) URL.revokeObjectURL(newStatus.preview);
    };
  }, [newStatus.preview]);

  const handleFileChange =  (e) => {
    const file = e.target.files[0];
    if (file) {
      if (newStatus.preview) URL.revokeObjectURL(newStatus.preview);

      setNewStatus({
        ...newStatus,
        image: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (e) => { 
  e.preventDefault();
  
  if (!newStatus.image && !newStatus.caption) {
    return toast.error("Please add something first!");
  }

  try {
    await onAddStatus({
      caption: newStatus.caption,
      file: newStatus.image
    });

    setNewStatus({ image: null, preview: "", caption: "" });
    setIsModalOpen(false); 
    
  } catch (err) {
    console.error("Submit error:", err);
  }
};

  return (
    <div className="w-full flex flex-col h-full bg-white relative">
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Updates</h1>
      </div>

      <div
        onClick={() => setIsModalOpen(true)}
        className="border-b flex items-center gap-4 p-4 hover:bg-gray-50 active:scale-[0.98] cursor-pointer transition-all"
      >
        <div className="relative flex-shrink-0">
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-orange-500 to-fuchsia-600">
            <div className="bg-white p-[6px] rounded-full h-14 w-14 ">
                      <img className="h-full w-full" src={Logoimage} />     
          </div>
            </div>
           
          <div className="absolute bottom-0 right-0 bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-white shadow-md">
            <Plus size={14} strokeWidth={3} />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">
            Add Status</h3>
          <p className="text-sm text-gray-500">Tap to add update</p>
        </div>
      </div>

      {/* Status List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {statuses.map((item) => (


          <div
            key={item.id}
            onClick={() => (item.isUser && !item.stories?.length) ? setIsModalOpen(true) : onSelect(item)}
            className="flex items-center gap-4 p-3 hover:bg-gray-50 active:scale-[0.98] cursor-pointer rounded-xl transition-all"
          >
            <div className="relative flex-shrink-0">
       <div className={`p-[2px] rounded-full transition-all duration-300 ${
  item.viewed 
    ? "bg-gray-300 !bg-none" // !bg-none gradient ko force-remove kar dega
    : "bg-gradient-to-tr from-yellow-400 via-orange-500 to-fuchsia-600"
}`}>
                <div className="bg-white p-[2px] rounded-full">
                  <img src={item.image} className="w-14 h-14 rounded-full object-cover" alt={item.name} />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-xs text-gray-500 uppercase">{item.time}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          {/* max-h-[90vh] ensures modal never exceeds screen height */}
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in duration-200">

            <div className="px-4 py-2 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
              <h2 className="font-bold text-lg text-gray-800">Create New Status</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-3 space-y-4 overflow-y-auto">

              <div className="flex flex-col items-center justify-center">
                {newStatus.preview ? (
                  <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden group shadow-inner bg-gray-100 border">
                    <img
                      src={newStatus.preview}
                      className="w-full h-full object-contain"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      onClick={() => setNewStatus({ ...newStatus, image: null, preview: "" })}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-40 sm:h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all group">
                    <Upload className="text-gray-400 group-hover:text-blue-500 mb-2 transition-colors" size={28} />
                    <span className="text-xs sm:text-sm text-gray-500 font-medium">Select a photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Caption
                </label>
                <textarea
                  placeholder="Say something about this photo..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 sm:h-13 resize-none transition-all"
                  value={newStatus.caption}
                  onChange={(e) => setNewStatus({ ...newStatus, caption: e.target.value })}
                />
              </div>

              <button
                type="submit" 
                disabled={loading}
                className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}        >{loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Posting...
                    </>
                  ) : (
                    "Post Now"
                  )}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}