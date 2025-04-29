import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Mecha Reactor</h1>
                    <div className="space-x-4">
                        <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
                        <Link to="/editor" className="text-blue-600 hover:text-blue-800">Part Editor</Link>
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    );
};

export default Layout;