import React from "react";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
    return (
        <div className="pt-[72px] pb-[80px] min-h-screen">
            <Outlet />
        </div>
    );
}
