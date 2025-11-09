import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import { LogoutIcon, SearchIcon } from '../../components/icons/Icons';
import { User, AssetListing } from '../../types';
import Spinner from '../../components/common/Spinner';

const mockListings: AssetListing[] = [
    { id: 'LST-001', asset: 'USDT', amount: 5000, pricePerUnit: 1450.50, localCurrency: 'NGN', status: 'Active' },
    { id: 'LST-002', asset: 'USDT', amount: 10000, pricePerUnit: 1.00, localCurrency: 'USD', status: 'Sold' },
    { id: 'LST-003', asset: 'USDT', amount: 2500, pricePerUnit: 13.10, localCurrency: 'GHS', status: 'Active' },
];

const StatusBadge: React.FC<{ status: AssetListing['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        Active: "bg-green-500/20 text-green-300",
        Sold: "bg-gray-500/20 text-gray-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const MerchantDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [listings, setListings] = useState(mockListings);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const newListing: AssetListing = {
            id: `LST-${String(listings.length + 1).padStart(3, '0')}`,
            asset: 'USDT',
            amount: parseFloat(formData.get('amount') as string),
            pricePerUnit: parseFloat(formData.get('pricePerUnit') as string),
            localCurrency: formData.get('localCurrency') as string,
            status: 'Active',
        };
        setTimeout(() => {
            setListings(prev => [newListing, ...prev]);
            setIsSubmitting(false);
            e.currentTarget.reset();
        }, 1500);
    };

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
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Search listings..." className="bg-primary-light border border-gray-medium rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-accent focus:border-accent w-96"/>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-white">{(user as User)?.name}</p>
                        <p className="text-sm text-gray-light">{(user as User)?.companyName}</p>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 bg-gray-dark">
                    <h1 className="text-3xl font-bold text-white mb-8">Merchant Portal</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <Card>
                                <h2 className="text-xl font-bold mb-4">Create New Listing</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                     <div>
                                        <label className="text-sm text-gray-light">Asset</label>
                                        <input value="USDT" readOnly className="w-full bg-gray-dark p-2 rounded border border-gray-medium text-gray-400 cursor-not-allowed" />
                                     </div>
                                     <div>
                                        <label className="text-sm text-gray-light">Amount</label>
                                        <input name="amount" type="number" step="0.01" required placeholder="5000.00" className="w-full bg-primary-light p-2 rounded border border-gray-medium" />
                                     </div>
                                     <div>
                                        <label className="text-sm text-gray-light">Price Per Unit</label>
                                        <input name="pricePerUnit" type="number" step="0.01" required placeholder="1450.50" className="w-full bg-primary-light p-2 rounded border border-gray-medium" />
                                     </div>
                                      <div>
                                        <label className="text-sm text-gray-light">Local Currency</label>
                                        <select name="localCurrency" required className="w-full bg-primary-light p-2 rounded border border-gray-medium">
                                            <option>NGN</option>
                                            <option>GHS</option>
                                            <option>KES</option>
                                            <option>USD</option>
                                        </select>
                                     </div>
                                     <button type="submit" disabled={isSubmitting} className="w-full bg-accent text-primary font-bold py-2 px-4 rounded hover:bg-yellow-400 flex items-center justify-center disabled:bg-gray-500">
                                         {isSubmitting ? <Spinner /> : 'Create Listing'}
                                     </button>
                                </form>
                            </Card>
                        </div>
                         <div className="lg:col-span-2">
                            <Card>
                                <h2 className="text-xl font-bold mb-4">Your Listings</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-light">
                                        <thead className="text-xs text-gray-400 uppercase bg-primary">
                                            <tr>
                                                <th scope="col" className="px-4 py-3">Asset</th>
                                                <th scope="col" className="px-4 py-3">Amount</th>
                                                <th scope="col" className="px-4 py-3">Price</th>
                                                <th scope="col" className="px-4 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listings.map(listing => (
                                                <tr key={listing.id} className="bg-primary-light border-b border-gray-medium">
                                                    <td className="px-4 py-3 font-medium text-white">{listing.asset}</td>
                                                    <td className="px-4 py-3 font-mono">{listing.amount.toFixed(2)}</td>
                                                    <td className="px-4 py-3 font-mono">{listing.pricePerUnit.toFixed(2)} {listing.localCurrency}</td>
                                                    <td className="px-4 py-3"><StatusBadge status={listing.status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MerchantDashboard;