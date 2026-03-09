import { useEffect } from "react"
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

function App() {

  useEffect(() => {
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;

      const btn = document.getElementById("installBtn");
      if(btn){
        btn.style.display = "block";

        btn.addEventListener("click", () => {
          deferredPrompt.prompt();
        });
      }
    });
  }, []);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Install Button */}
      <button id="installBtn" style={{display:"none",position:"fixed",bottom:"20px",right:"20px",padding:"10px"}}>
        Install ChatVibe
      </button>

      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/" element={<MainLayout />} >
            <Route index element={<Chatpage />} />
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