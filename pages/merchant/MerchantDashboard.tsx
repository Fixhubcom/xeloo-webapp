
import React from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import { LogoutIcon } from '../../components/icons/Icons';
import { User } from '../../types';

const MerchantDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    return (
        <div className="flex h-screen bg-gray-dark">
            <aside className="w-64 bg-primary flex flex-col">
                <div className="h-20 flex items-center justify-center border-b border-primary-light">
                    <Logo className="text-3xl" />
                </div>
                 <nav className="flex-1 px-4 py-6 space-y-2">
                    {/* Merchant Nav Items Here */}
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
                    <h1 className="text-2xl font-bold text-white">Merchant Portal</h1>
                    <div className="text-right">
                        <p className="font-semibold text-white">{(user as User)?.name}</p>
                        <p className="text-sm text-gray-light">{(user as User)?.companyName}</p>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 bg-gray-dark">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Manage Asset Listings</h2>
                        <p className="text-gray-light">This section allows merchants to list USDT or other digital assets for sale to provide liquidity to the Xeloo ecosystem. Listings would be verified for price competitiveness.</p>
                        {/* A form to create listings and a table of existing listings would go here */}
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default MerchantDashboard;
