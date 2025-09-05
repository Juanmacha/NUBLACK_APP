import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/sidebar";

function Dashboard() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-4 bg-gray-100 overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}

export default Dashboard;