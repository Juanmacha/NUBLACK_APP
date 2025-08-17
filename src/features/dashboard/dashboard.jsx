import React from "react";
import Sidebar from "./components/sidebar";

function Dashboard() {
    return (
        <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-4 bg-gray-100">
            {/* Aquí puedes agregar el contenido del dashboard */}
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Bienvenido al panel de control.</p>
        </div>
        </div>
    );
}

export default Dashboard;