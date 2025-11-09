

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import { 
    LogoutIcon, 
    SearchIcon, 
    DashboardIcon, 
    ShoppingBagIcon, 
    TransactionsIcon, 
    BriefcaseIcon, 
    AnalyticsIcon, 
    CodeIcon, 
    SettingsIcon, 
    SupportIcon,
    UsersIcon
} from '../../components/icons/Icons';
import { User, AssetListing } from '../../types';
import Spinner from '../../components/common/Spinner';
import TeamManagement from './TeamManagement';
import MerchantSettings from './MerchantSettings';

const mockListings: AssetListing[] = [
    { id: 'LST-001', asset: 'USDT', amount: 5000, pricePerUnit: 1450.50, localCurrency: 'NGN', status: 'Active' },
    { id: 'LST-002', asset: 'USDT', amount: 10000, pricePerUnit: 1.00, localCurrency: 'USD', status: 'Sold' },
    { id: 'LST-003', asset: 'USDT', amount: 2500, pricePerUnit: 13.10, localCurrency: 'GHS', status: 'Active' },
];

const merchantFundsFlowData = [
    { currency: 'NGN', volume: 7252500 },
    { currency: 'USD', volume: 10000 },
    { currency: 'GHS', volume: 32750 },
];

// Type for navigation items
type NavItem =
    | 'Dashboard'
    | 'Listings'
    | 'Transactions'
    | 'Settlements'
    | 'Reports'
    | 'API Management'
    | 'Team Management'
    | 'Settings'
    | 'Support';

// Placeholder Component
const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <Card>
        <h2 className="text-xl font-bold mb-4">{title} Management</h2>
        <p className="text-gray-400">This is the dedicated section for managing {title.toLowerCase()}.</p>
        <div className="mt-6 p-8 border-2 border-dashed border-primary rounded-lg text-center text-gray-500">
            [Feature component for {title} will be displayed here.]
        </div>
    </Card>
);

// Dashboard Overview Component
const MerchantOverview: React.FC = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center"><h3 className="text-lg text-gray-400">Total Sales (30d)</h3><p className="text-3xl font-bold text-accent">$18,500</p></Card>
            <Card className="text-center"><h3 className="text-lg text-gray-400">Active Listings</h3><p className="text-3xl font-bold text-accent">2</p></Card>
            <Card className="text-center"><h3 className="text-lg text-gray-400">Pending Payout</h3><p className="text-3xl font-bold text-accent">$5,250</p></Card>
        </div>
        <Card>
            <h2 className="text-xl font-bold mb-4">Sales Volume by Currency</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={merchantFundsFlowData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#294A21" />
                    <XAxis type="number" stroke="#a8a29e" tickFormatter={(value) => `${Number(value / 1000).toLocaleString()}k`} />
                    <YAxis type="category" dataKey="currency" stroke="#a8a29e" width={40} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#041401', border: '1px solid #294A21' }}
                        formatter={(value: number, name: string, props) => [`${value.toLocaleString()} ${props.payload.currency}`, 'Volume']}
                        labelFormatter={() => ''}
                    />
                    <Bar dataKey="volume" fill="#FDDA1A" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    </div>
);


// Listing Management Component
const StatusBadge: React.FC<{ status: AssetListing['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        Active: "bg-accent/20 text-accent",
        Sold: "bg-gray-500/20 text-gray-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ListingManagement: React.FC = () => {
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Create New Listing</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                            <label className="text-sm text-gray-400">Asset</label>
                            <input value="USDT" readOnly className="w-full bg-primary p-2 rounded border border-primary-light text-gray-400 cursor-not-allowed" />
                         </div>
                         <div>
                            <label className="text-sm text-gray-400">Amount</label>
                            <input name="amount" type="number" step="0.01" required placeholder="5000.00" className="w-full bg-primary p-2 rounded border border-primary-light" />
                         </div>
                         <div>
                            <label className="text-sm text-gray-400">Price Per Unit</label>
                            <input name="pricePerUnit" type="number" step="0.01" required placeholder="1450.50" className="w-full bg-primary p-2 rounded border border-primary-light" />
                         </div>
                          <div>
                            <label className="text-sm text-gray-400">Local Currency</label>
                            <select name="localCurrency" required className="w-full bg-primary p-2 rounded border border-primary-light">
                                <option>NGN</option>
                                <option>GHS</option>
                                <option>KES</option>
                                <option>USD</option>
                            </select>
                         </div>
                         <button type="submit" disabled={isSubmitting} className="w-full bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center disabled:bg-gray-500">
                             {isSubmitting ? <Spinner /> : 'Create Listing'}
                         </button>
                    </form>
                </Card>
            </div>
             <div className="lg:col-span-2">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Your Listings</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
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
                                    <tr key={listing.id} className="bg-primary-light border-b border-primary">
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
    );
};


const MerchantDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [activeView, setActiveView] = useState<NavItem>('Dashboard');

     const renderContent = () => {
        switch (activeView) {
            case 'Dashboard': return <MerchantOverview />;
            case 'Listings': return <ListingManagement />;
            case 'Transactions': return <PlaceholderContent title="Transactions" />;
            case 'Settlements': return <PlaceholderContent title="Settlements" />;
            case 'Reports': return <PlaceholderContent title="Reports" />;
            case 'API Management': return <PlaceholderContent title="API Management" />;
            case 'Team Management': return <TeamManagement />;
            case 'Settings': return <MerchantSettings />;
            case 'Support': return <PlaceholderContent title="Support" />;
            default: return <MerchantOverview />;
        }
    };

    return (
        <div className="flex h-screen bg-primary">
            <aside className="w-64 bg-primary flex flex-col shadow-lg">
                <div className="h-20 flex items-center justify-center border-b border-primary-light">
                    <Logo className="text-3xl" />
                </div>
                 <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                     <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
                    <NavItemLink icon={<DashboardIcon />} label="Dashboard" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<ShoppingBagIcon />} label="Listings" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<TransactionsIcon />} label="Transactions" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<BriefcaseIcon />} label="Settlements" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<UsersIcon />} label="Team Management" activeItem={activeView} setItem={setActiveView} />

                    <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform</p>
                    <NavItemLink icon={<AnalyticsIcon />} label="Reports" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<CodeIcon />} label="API Management" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<SettingsIcon />} label="Settings" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<SupportIcon />} label="Support" activeItem={activeView} setItem={setActiveView} />
                 </nav>
                <div className="px-4 py-4 border-t border-primary-light">
                    <button onClick={logout} className="w-full flex items-center px-4 py-2 text-gray-400 hover:bg-primary-light hover:text-white rounded-md transition-colors">
                        <LogoutIcon className="mr-3 w-5 h-5"/>
                        Logout
                    </button>
                </div>
            </aside>
             <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-primary flex items-center justify-between px-8 border-b border-primary-light">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Search listings, transactions..." className="bg-primary-light border border-primary rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-accent focus:border-accent w-96"/>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-white">{(user as User)?.name}</p>
                        <p className="text-sm text-gray-400">{(user as User)?.companyName}</p>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 bg-primary">
                    <h1 className="text-3xl font-bold text-white mb-8">{activeView}</h1>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

interface NavItemLinkProps {
  icon: React.ReactElement<{ className?: string }>;
  label: NavItem;
  activeItem: NavItem;
  setItem: (item: NavItem) => void;
}

const NavItemLink: React.FC<NavItemLinkProps> = ({ icon, label, activeItem, setItem }) => {
  const isActive = activeItem === label;
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setItem(label);
      }}
      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-accent text-primary'
          : 'text-gray-400 hover:bg-primary-light hover:text-white'
      }`}
    >
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
        <span className="ml-3">{label}</span>
    </a>
  );
};

export default MerchantDashboard;
