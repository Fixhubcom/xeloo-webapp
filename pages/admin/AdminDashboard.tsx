import React from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import { LogoutIcon, SearchIcon } from '../../components/icons/Icons';
import { User } from '../../types';

const AdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    return (
        <div className="flex h-screen bg-gray-dark">
            <aside className="w-64 bg-primary flex flex-col">
                <div className="h-20 flex items-center justify-center border-b border-primary-light">
                    <Logo className="text-3xl" />
                </div>
                 <nav className="flex-1 px-4 py-6 space-y-2">
                    {/* Admin Nav Items Here */}
                 </nav>
                <div className="px-4 py-4 border-t border-primary-light">
                    <button onClick={logout} className="w-full flex items-center px-4 py-2 text-gray-light hover:bg-primary-light hover:text-white rounded-md transition-colors">
                        <LogoutIcon className="mr-3"/>
                        Logout
                    </button>
                </div>
            </aside>
             <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-primary flex items-center justify-between px-8 border-b border-primary-light">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Search..." className="bg-primary-light border border-gray-medium rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-accent focus:border-accent w-96"/>
                    </div>
                     <div className="text-right">
                        <p className="font-semibold text-white">{(user as User)?.name}</p>
                        <p className="text-sm text-gray-light">{(user as User)?.companyName}</p>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 bg-gray-dark">
                    <h1 className="text-3xl font-bold text-white mb-8">Super Admin Dashboard</h1>
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Platform Overview</h2>
                        <p className="text-gray-light">This is the central control panel for monitoring all transactions, commissions, partner settlements, and system health.</p>
                        {/* High-level analytics and management tools would go here */}
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;