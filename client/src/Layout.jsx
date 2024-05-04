import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout(){
    return (
        <div className="py-6 sm:px-6 md:px-8 lg:px-16 xl:px-64 flex flex-col min-h-screen">
            <Header />
            <Outlet />

        </div>
    )
}