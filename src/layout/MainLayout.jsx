import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";




export default function MainLayout() {

    const location = useLocation()
    const hidenav = location.pathname.startsWith("/chat")

    return (
        <div className="h-screen  flex flex-col md:flex-row ">

            <div className={`order-2 h-[10%] md:order-1 md:h-auto  order-2 md:order-1 
          ${hidenav ? "hidden" : "block"}
          md:block`}>
                <Sidebar />
            </div>

            <div className="flex-1 bg-gray-100 h-[90%] order-1 md:order-2 md:h-auto">
                <Outlet />
            </div>
        </div>
    );
}