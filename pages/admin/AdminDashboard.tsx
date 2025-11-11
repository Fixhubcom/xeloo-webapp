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
    SettingsIcon,
    MenuIcon,
    SunIcon,
    MoonIcon,
} from '../../components/icons/Icons';
import { User } from '../../types';
import UserManagement from './UserManagement';
import SecurityManagement from './SecurityManagement';
import SupportManagement from './SupportManagement';
import BlockchainManagement from './BlockchainManagement';
import AdminSettings from './AdminSettings';
import AdminTeamManagement from './TeamManagement';
import PartnersManagement from './PartnersManagement';
import MerchantsManagement from './MerchantsManagement';
import TransactionsManagement from './TransactionsManagement';
import AdminReports from './AdminReports';
import AdminApiManagement from './AdminApiManagement';
import CommissionEarnings from './CommissionEarnings';
import SubscriptionEarnings from './SubscriptionEarnings';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../../components/common/Avatar';

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
    | 'Settings'
    | 'Commission Earnings'
    | 'Subscription Earnings';


// Placeholder components for each section
const AdminOverview: React.FC<{ setActiveView: (view: NavItem) => void }> = ({ setActiveView }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center"><h3 className="text-lg text-gray-400">Total Users</h3><p className="text-3xl font-bold text-accent">102,495</p></Card>
            <Card className="text-center"><h3 className="text-lg text-gray-400">Volume (24h)</h3><p className="text-3xl font-bold text-accent">$1.2M</p></Card>
            <Card 
                className="text-center cursor-pointer hover:border-accent transition-colors"
                onClick={() => setActiveView('Commission Earnings')}
            >
                <h3 className="text-lg text-gray-400">Commission Earned (30d)</h3>
                <p className="text-3xl font-bold text-accent">$75,320</p>
            </Card>
            <Card 
                className="text-center cursor-pointer hover:border-accent transition-colors"
                onClick={() => setActiveView('Subscription Earnings')}
            >
                <h3 className="text-lg text-gray-400">Subscription Earnings (30d)</h3>
                <p className="text-3xl font-bold text-accent">$12,850</p>
            </Card>
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

const AdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeView, setActiveView] = useState<NavItem>('Dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const navigateTo = (view: NavItem) => {
        setActiveView(view);
        setIsSidebarOpen(false);
    }

    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard': return <AdminOverview setActiveView={navigateTo} />;
            case 'Partners': return <PartnersManagement searchQuery={searchQuery} />;
            case 'Merchants': return <MerchantsManagement searchQuery={searchQuery} />;
            case 'Users': return <UserManagement searchQuery={searchQuery} />;
            case 'Team Management': return <AdminTeamManagement searchQuery={searchQuery} />;
            case 'Transactions': return <TransactionsManagement searchQuery={searchQuery} />;
            case 'Support': return <SupportManagement searchQuery={searchQuery} />;
            case 'Blockchain': return <BlockchainManagement searchQuery={searchQuery} />;
            case 'API': return <AdminApiManagement searchQuery={searchQuery} />;
            case 'Reports': return <AdminReports />;
            case 'Security': return <SecurityManagement />;
            case 'Settings': return <AdminSettings />;
            case 'Commission Earnings': return <CommissionEarnings searchQuery={searchQuery} />;
            case 'Subscription Earnings': return <SubscriptionEarnings searchQuery={searchQuery} />;
            default: return <AdminOverview setActiveView={navigateTo} />;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-primary overflow-hidden">
             {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
            <aside className={`w-64 bg-white dark:bg-primary flex flex-col shadow-lg fixed z-30 inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
                <div className="h-20 flex items-center justify-center border-b border-gray-200 dark:border-primary-light">
                    <Logo className="text-3xl" />
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
                    <NavItemLink icon={<DashboardIcon />} label="Dashboard" activeItem={activeView} setItem={navigateTo} />

                    <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
                    <NavItemLink icon={<BriefcaseIcon />} label="Partners" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<ShoppingBagIcon />} label="Merchants" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<UsersIcon />} label="Users" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<UsersIcon />} label="Team Management" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<TransactionsIcon />} label="Transactions" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<SupportIcon />} label="Support" activeItem={activeView} setItem={navigateTo} />

                    <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform</p>
                    <NavItemLink icon={<CubeIcon />} label="Blockchain" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<CodeIcon />} label="API" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<AnalyticsIcon />} label="Reports" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<ShieldCheckIcon />} label="Security" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<SettingsIcon />} label="Settings" activeItem={activeView} setItem={navigateTo} />
                </nav>
                <div className="px-4 py-4 border-t border-gray-200 dark:border-primary-light">
                    <button onClick={logout} className="w-full flex items-center px-4 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary-light hover:text-gray-900 dark:hover:text-white rounded-md transition-colors">
                        <LogoutIcon className="mr-3 w-5 h-5"/>
                        Logout
                    </button>
                </div>
            </aside>

             <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-white dark:bg-primary flex items-center justify-between px-4 sm:px-8 border-b border-gray-200 dark:border-primary-light flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 dark:text-gray-400 focus:outline-none">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        <div className="relative hidden md:block">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-gray-100 dark:bg-primary-light border border-gray-300 dark:border-primary rounded-md py-2 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent w-64 lg:w-96"
                            />
                        </div>
                    </div>
                     <div className="flex items-center space-x-2 sm:space-x-4">
                        <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary-light md:hidden">
                            <SearchIcon className="w-6 h-6" />
                        </button>
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary-light">
                            {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-700" />}
                        </button>
                        <div className="flex items-center space-x-3">
                             <Avatar 
                                initials={user?.avatarInitials || ''}
                                bgColor={user?.avatarBgColor || '#ccc'}
                                className="w-10 h-10 text-lg"
                            />
                            <div className="text-right hidden sm:block">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">{(user as User)?.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{(user as User)?.companyName}</p>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-100 dark:bg-primary">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">{activeView}</h1>
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
  
  // Do not render the new detail views in the sidebar
  if (label === 'Commission Earnings' || label === 'Subscription Earnings') {
    return null;
  }

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
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary-light hover:text-gray-900 dark:hover:text-white'
      }`}
    >
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
        <span className="ml-3">{label}</span>
    </a>
  );
};


export default AdminDashboard;