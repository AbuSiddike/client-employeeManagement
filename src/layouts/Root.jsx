import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Root() {
    return (
        <div className="bg-base-200 min-h-screen">
            <Navbar />
            <div className="pt-20">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
