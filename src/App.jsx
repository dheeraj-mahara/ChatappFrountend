import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainLayout from "./layout/MainLayout";
import StatusPage from "./pages/StatusPage";
import ProfilePage from "./pages/ProfilePage";
import Chatpage from "./pages/Chatpage"
import Postpage from "./pages/Postpage"
import Callpage from "./pages/Callpage"
import AuthLayout from "./layout/AuthLayout"
import Logoimage from "./assets/images.png";
import axios from "axios";
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";
import { useAuth } from "./context/AuthContext";

function App() {

  const { currentUser, loading } = useAuth();
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {

    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)

  }, [])

  const installApp = async () => {
    if (!installPrompt) return

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice

    if (outcome === "accepted") {
      setShowInstall(false)
    }
  }

  useEffect(() => {

    Notification.requestPermission().then((permission) => {
  if (!currentUser) return;

      if (permission === "granted") {

        getToken(messaging, {
          vapidKey: "BHMc1PflVgXppKk2jfzMUCaT-z8CKkT1XMHUdYkqw2iKKsawsYKMah7Bfv--AfqALcDg25Y80xHt2o_6kobAT1c"
        }).then((token) => {


          axios.post(`${import.meta.env.VITE_API_URL}/api/notification/save-token`, {
          userId: currentUser.userid,
          token: token
        });

        });
        

      }

    });
  }, [currentUser]);
  

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      {/* INSTALL BANNER */}
      {showInstall && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white shadow-xl rounded-2xl border flex items-center justify-between p-3 z-50">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-white font-bold">
              <img src={Logoimage} alt="" />
            </div>

            <div className="text-sm">
              <p className="font-semibold">Install ChatVibe</p>
              <p className="text-gray-500 text-xs">
                Faster experience like an app
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <button
              onClick={installApp}
              className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600"
            >
              Install
            </button>

            <button
              onClick={() => setShowInstall(false)}
              className="text-gray-400 hover:text-black text-lg"
            >
              ✕
            </button>

          </div>
        </div>
      )}

      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/" element={<MainLayout />} >
            <Route index element={<Chatpage />} />
            <Route path="/chat/users" element={<Chatpage />} />
            <Route path="/chat/:receiverId" element={<Chatpage />} />
            <Route path="status" element={<StatusPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="post" element={<Postpage />} />
            <Route path="call" element={<Callpage />} />
          </Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App