
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import { LogoutIcon, SearchIcon } from '../../components/icons/Icons';
import { User } from '../../types';
import PartnerSettlements from './PartnerSettlements';

const partnerFundsFlowData = [
  { currency: 'USD', volume: 1200000 },
  { currency: 'NGN', volume: 850000 },
  { currency: 'GBP', volume: 450000 },
  { currency: 'KES', volume: 250000 },
  { currency: 'GHS', volume: 150000 },
];

const PartnerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  return (
        <div className="flex h-screen bg-gray-dark">
            <aside className="w-64 bg-primary flex flex-col">
                <div className="h-20 flex items-center justify-center border-b border-primary-light">
                    <Logo className="text-3xl" />
                </div>
                 <nav className="flex-1 px-4 py-6 space-y-2">
                    {/* Partner Nav Items Here */}
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
                        <input type="text" placeholder="Search settlements..." className="bg-primary-light border border-gray-medium rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-accent focus:border-accent w-96"/>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-white">{(user as User)?.name}</p>
                        <p className="text-sm text-gray-light">{(user as User)?.companyName}</p>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 bg-gray-dark">
                    <h1 className="text-3xl font-bold text-white mb-8">Partner Portal</h1>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="text-center">
                            <h3 className="text-lg text-gray-light">Total Volume (30d)</h3>
                            <p className="text-3xl font-bold text-accent">$2.5M</p>
                        </Card>
                        <Card className="text-center">
                            <h3 className="text-lg text-gray-light">Pending Settlements</h3>
                            <p className="text-3xl font-bold text-yellow-400">$150,000</p>
                        </Card>
                        <Card className="text-center">
                            <h3 className="text-lg text-gray-light">Commission Earned (30d)</h3>
                            <p className="text-3xl font-bold text-green-400">$25,000</p>
                        </Card>
                    </div>

                    <Card className="mb-8">
                        <h3 className="text-xl font-bold mb-4">Transaction Volume by Currency (Last 30d)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={partnerFundsFlowData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="currency" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }} 
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                                />
                                <Bar dataKey="volume" fill="#fdda1a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <PartnerSettlements />
                </div>
            </main>
        </div>
    );
};

export default PartnerDashboard;
