
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import {
    LogoutIcon,
    SearchIcon,
    DashboardIcon,
    BriefcaseIcon,
    ShoppingBagIcon,
    UsersIcon,
    TransactionsIcon,
    SupportIcon,
    CubeIcon,
    CodeIcon,
    AnalyticsIcon,
    ShieldCheckIcon,
    SettingsIcon
} from '../../components/icons/Icons';
import { User } from '../../types';
import UserManagement from './UserManagement';
import SecurityManagement from './SecurityManagement';
import SupportManagement from './SupportManagement';
import BlockchainManagement from './BlockchainManagement';
import AdminSettings from './AdminSettings';
import AdminTeamManagement from './TeamManagement';

// Data for the main dashboard chart
const adminFundsFlowData = [
  { corridor: 'USA → NGN', volume: 5000000 },
  { corridor: 'UK → GHS', volume: 2500000 },
  { corridor: 'USA → KES', volume: 1800000 },
  { corridor: 'EUR → NGN', volume: 3200000 },
  { corridor: 'CAN → USD', volume: 4100000 },
];

// Type for navigation items
type NavItem =
    | 'Dashboard'
    | 'Partners'
    | 'Merchants'
    | 'Users'
    | 'Team Management'
    | 'Transactions'
    | 'Support'
    | 'Blockchain'
    | 'API'
    | 'Reports'
    | 'Security'
    | 'Settings';


// Placeholder components for each section
const AdminOverview: React.FC = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center"><h3 className="text-lg text-gray-400">Total Users</h3><p className="text-3xl font-bold text-accent">102,495</p></Card>
            <Card className="text-center"><h3 className="text-lg text-gray-400">Total Partners</h3><p className="text-3xl font-bold text-accent">15</p></Card>
            <Card className="text-center"><h3 className="text-lg text-gray-400">Total Merchants</h3><p className="text-3xl font-bold text-accent">350</p></Card>
            <Card className="text-center"><h3 className="text-lg text-gray-400">Volume (24h)</h3><p className="text-3xl font-bold text-accent">$1.2M</p></Card>
        </div>
        <Card>
            <h2 className="text-xl font-bold mb-4">Top Transaction Corridors by Volume</h2>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={adminFundsFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#294A21" />
                    <XAxis dataKey="corridor" stroke="#a8a29e" />
                    <YAxis stroke="#a8a29e" tickFormatter={(value) => `$${Number(value / 1000000)}M`} />
                    <Tooltip contentStyle={{ backgroundColor: '#041401', border: '1px solid #294A21' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']} />
                    <Bar dataKey="volume" fill="#FDDA1A" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    </div>
);

const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <Card>
        <h2 className="text-xl font-bold mb-4">{title} Management</h2>
        <p className="text-gray-400">This is the central control panel for managing all {title.toLowerCase()}. You can view, add, edit, and approve records from this section.</p>
        <div className="mt-6 p-8 border-2 border-dashed border-primary rounded-lg text-center text-gray-500">
            [Management table and controls for {title} will be displayed here.]
        </div>
    </Card>
);

const AdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [activeView, setActiveView] = useState<NavItem>('Dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard': return <AdminOverview />;
            case 'Partners': return <PlaceholderContent title="Partners" />;
            case 'Merchants': return <PlaceholderContent title="Merchants" />;
            case 'Users': return <UserManagement />;
            case 'Team Management': return <AdminTeamManagement />;
            case 'Transactions': return <PlaceholderContent title="Transactions" />;
            case 'Support': return <SupportManagement />;
            case 'Blockchain': return <BlockchainManagement />;
            case 'API': return <PlaceholderContent title="API" />;
            case 'Reports': return <PlaceholderContent title="Reports & Analytics" />;
            case 'Security': return <SecurityManagement />;
            case 'Settings': return <AdminSettings />;
            default: return <AdminOverview />;
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

                    <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
                    <NavItemLink icon={<BriefcaseIcon />} label="Partners" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<ShoppingBagIcon />} label="Merchants" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<UsersIcon />} label="Users" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<UsersIcon />} label="Team Management" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<TransactionsIcon />} label="Transactions" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<SupportIcon />} label="Support" activeItem={activeView} setItem={setActiveView} />

                    <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform</p>
                    <NavItemLink icon={<CubeIcon />} label="Blockchain" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<CodeIcon />} label="API" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<AnalyticsIcon />} label="Reports" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<ShieldCheckIcon />} label="Security" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<SettingsIcon />} label="Settings" activeItem={activeView} setItem={setActiveView} />
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
                        <input type="text" placeholder="Search users, txns, partners..." className="bg-primary-light border border-primary rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-accent focus:border-accent w-96"/>
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


export default AdminDashboard;