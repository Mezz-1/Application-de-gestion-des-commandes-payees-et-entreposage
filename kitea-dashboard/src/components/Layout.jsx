import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout({ user, onLogout }) { // <-- Must capture it here!
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden w-full">
            {/* 🧭 Forward the logic cleanly to the child view */}
            <Sidebar user={user} onLogout={onLogout} />

            <main className="flex-1 overflow-y-auto relative p-6">
                <Outlet />
            </main>
        </div>
    );
}