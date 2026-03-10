import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import socket from "../socket";
import { FiArrowLeft } from "react-icons/fi";
import { Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ChatArea({ selectedUser, currentUser, onBack }) {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const fileRef = useRef(null);
  const bottomRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [bigImage, setbigImage] = useState(null);
  const [imgLoading, setImgLoading] = useState(true);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!receiverId) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/chat/${receiverId}`,
          { withCredentials: true }
        );
        setMessages(res.data.chatData?.messages || []);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };
    fetchMessages();
  }, [receiverId]);

  useEffect(() => {
    if (!currentUser?.id) return;
    socket.auth = { userId: currentUser.id };
    if (!socket.connected) socket.connect();
  }, [currentUser?.id]);

  useEffect(() => {
    if (!receiverId || !currentUser?.id) return;

    const handleMessage = (msg) => {
      if (
        (String(msg.senderId) === String(receiverId) && String(msg.receiverId) === String(currentUser.id)) ||
        (String(msg.senderId) === String(currentUser.id) && String(msg.receiverId) === String(receiverId))
      ) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("newMessage", handleMessage);
    return () => socket.off("newMessage", handleMessage);
  }, [receiverId, currentUser?.id]);

  const sendMessage = async () => {
    const imageFile = fileRef.current?.files[0];
    if (!text.trim() && !imageFile) return;
    setPreviewImage(null)
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      message: text.trim(),
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : null,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");
    if (fileRef.current) fileRef.current.value = "";

    const formData = new FormData();
    formData.append("text", tempMessage.message);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/${selectedUser.id}`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {

        const savedMessage = res.data.savedMessage.savedMessage;
        setMessages((prev) =>
          prev.map((m) =>
            m._id === tempId
              ? { ...savedMessage, imageUrl: savedMessage.imageUrl || m.imageUrl }
              : m
          )
        );
        socket.emit("sendMessage", { ...savedMessage, receiverId: selectedUser.id });
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  const getMessageDateLabel = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);


    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">💬</span>
        </div>
        <p className="text-lg font-medium">Your Messages</p>
        <p className="text-sm">Select a contact to start a conversation</p>
      </div>
    );
  }

  const handleDeleteMessage = async (messageId) => {

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/chat/message/${messageId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Message deleted");
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete message");
    }
  };



  return (
    <div className="flex-1 flex flex-col bg-[#F3F4F6] h-screen">
      {/* CHAT HEADER */}
      <div className="px-6 py-3 border-b bg-white flex items-center gap-4 shadow-sm z-10">

        <button
          onClick={onBack}
          className="w-4 h-4 flex items-center justify-center bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <FiArrowLeft size={11} />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">
          {selectedUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-bold text-gray-800 leading-tight">{selectedUser.name}</h2>
          <div className="flex items-center gap-1.5">
            {selectedUser.online ?
              <> <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500 font-medium">Online</span></>
              :
              <span className="text-xs text-gray-500 font-medium">Offline</span>
            }
          </div>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 custom-scrollbar">
        {messages.map((msg, index) => {
          const isMe = String(msg.senderId) === String(currentUser.id);

          const currentDate = msg.createdAt ? new Date(msg.createdAt).toDateString() : null;
          const previousDate = index > 0 && messages[index - 1].createdAt
            ? new Date(messages[index - 1].createdAt).toDateString()
            : null;




          const showDateHeader = currentDate && currentDate !== previousDate;
          return (
            <React.Fragment key={msg._id || index}>
              {showDateHeader && (
                <div className="flex justify-center my-4 sticky top-0 z-20">
                  <span className="bg-gray-200/80 backdrop-blur-sm text-gray-600 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider min-w-[100px] text-center">
                    {getMessageDateLabel(msg.createdAt)}
                  </span>
                </div>
              )}

              <div className={`flex group ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"} relative`}>

                  {isMe && (
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="hidden group-hover:flex absolute -left-8 top-2 p-1 text-gray-400 hover:text-red-500 transition-all"
                      title="Delete Message"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  {/* Bubble UI */}
                  <div className={`px-3 py-2 shadow-sm 
              ${isMe
                      ? "bg-blue-600 text-white rounded-2xl rounded-br-none"
                      : "bg-white text-gray-800 rounded-2xl rounded-bl-none border border-gray-100"
                    }`}
                  >
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="message"
                        onClick={() => setbigImage(msg)}
                        className="rounded-lg mb-2 max-h-72 w-full object-cover border border-black/5 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    )}
                    {msg.message && <p className="text-[15px]">{msg.message}</p>}
                  </div>


                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                    {msg.pending ? ( "• Sending..." ) : (
                      msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit', minute: '2-digit', hour12: true
                      }) : msg.time
                    )}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={bottomRef}></div>
      </div>

      {previewImage && (
        <div className="px-4 pb-2">
          <div className="relative w-32">
            <img
              src={previewImage}
              className="rounded-lg border"
            />
            <button
              onClick={() => {
                setPreviewImage(null);
                fileRef.current.value = "";
              }}
              className="absolute -top-2 -right-2 bg-black text-white rounded-full px-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* INPUT AREA */}
      <div className="p-2 bg-white border-t">
        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-200 focus-within:border-blue-400 transition-all">

          <button
            onClick={() => fileRef.current.click()}
            className="px-1.5 py-1 text-gray-500 hover:bg-gray-200 rounded-xl transition-colors"
          >
            📸
          </button>
          <input
            type="file"
            ref={fileRef}
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setPreviewImage(URL.createObjectURL(file));
              }
            }}
          />
          <textarea
            rows="1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Write a message..."
            className="flex-1 bg-transparent border-none outline-none py-1.5 px-2 text-[15px] resize-none max-h-32"
          />

          <button
            onClick={sendMessage}
            disabled={!text.trim() && !fileRef.current?.files?.[0]}
            className={`py-1 px-2 rounded-xl transition-all ${text.trim() || previewImage ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-200  text-black"
              }`}>Send
          </button>
        </div>
      </div>



      {bigImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => { setbigImage(null); setImgLoading(true); }}
        >
          <div className="absolute top-6 right-6 flex items-center gap-4">
            {String(bigImage.senderId) === String(currentUser.id) && (
              <button
                className="p-3 bg-white/10 hover:bg-red-500/20 text-white hover:text-red-500 rounded-full transition-all border border-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMessage(bigImage._id);
                  setbigImage(null);
                }}
                title="Delete"
              >
                <Trash2 size={24} />
              </button>
            )}

            <button
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
              onClick={() => { setbigImage(null); setImgLoading(true); }}
            >
              <X size={24} />
            </button>
          </div>

          {imgLoading && (
            <div className="absolute flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white/50 text-xs">Loading image...</p>
            </div>
          )}

          <img
            src={bigImage.imageUrl}
            alt="Preview"
            onLoad={() => setImgLoading(false)}
            className={`max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl transition-opacity duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
            onClick={(e) => e.stopPropagation()}
          />
          {/* Caption */}
          {!imgLoading && bigImage.message && (
            <p className="text-white/90 mt-6 text-lg bg-black/20 px-4 py-2 rounded-lg">{bigImage.message}</p>
          )}
        </div>
      )}
    </div>
  );
}