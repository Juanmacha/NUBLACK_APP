import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom'; 
import Landing from "../features/landing/components/landing";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default AppRoutes;