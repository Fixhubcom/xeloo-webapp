import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import { 
    LogoutIcon, 
    SearchIcon, 
    DashboardIcon, 
    TransactionsIcon, 
    BriefcaseIcon, 
    CodeIcon, 
    AnalyticsIcon, 
    SettingsIcon, 
    SupportIcon,
    UsersIcon,
    CubeIcon,
    MenuIcon,
    SunIcon,
    MoonIcon,
} from '../../components/icons/Icons';
import { User, UserRole } from '../../types';
import PartnerSettlements from './PartnerSettlements';
import TeamManagement from './TeamManagement';
import ApiManagement from './ApiManagement';
import BlockchainManagement from './BlockchainManagement';
import PartnerSettings from './PartnerSettings';
import ReportsManagement from '../ReportsManagement';
import SupportManagement from '../SupportManagement';
import PartnerTransactions from './PartnerTransactions';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../../components/common/Avatar';

// Data for the main dashboard chart
const partnerFundsFlowData = [
  { currency: 'USD', volume: 1200000 },
  { currency: 'NGN', volume: 850000 },
  { currency: 'GBP', volume: 450000 },
  { currency: 'KES', volume: 250000 },
  { currency: 'GHS', volume: 150000 },
];

// Type for navigation items
type NavItem =
    | 'Dashboard'
    | 'Transactions'
    | 'Settlements'
    | 'API Management'
    | 'Blockchain'
    | 'Team Management'
    | 'Reports'
    | 'Settings'
    | 'Support';

const PartnerOverview: React.FC = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
                <h3 className="text-lg text-gray-400">Total Volume (30d)</h3>
                <p className="text-3xl font-bold text-accent">$2.5M</p>
            </Card>
            <Card className="text-center">
                <h3 className="text-lg text-gray-400">Pending Settlements</h3>
                <p className="text-3xl font-bold text-accent">$150,000</p>
            </Card>
            <Card className="text-center">
                <h3 className="text-lg text-gray-400">Total Funds Sent Out (30d)</h3>
                <p className="text-3xl font-bold text-accent">$1.8M</p>
            </Card>
        </div>
        <Card>
            <h3 className="text-xl font-bold mb-4">Transaction Volume by Currency (Last 30d)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={partnerFundsFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#294A21" />
                    <XAxis dataKey="currency" stroke="#a8a29e" />
                    <YAxis stroke="#a8a29e" tickFormatter={(value) => `$${Number(value).toLocaleString()}`} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#041401', border: '1px solid #294A21' }} 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
                    />
                    <Bar dataKey="volume" fill="#FDDA1A" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    </div>
);


const PartnerDashboard: React.FC = () => {
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
            case 'Dashboard': return <PartnerOverview />;
            case 'Transactions': return <PartnerTransactions searchQuery={searchQuery} />;
            case 'Settlements': return <PartnerSettlements searchQuery={searchQuery} />;
            case 'API Management': return <ApiManagement />;
            case 'Blockchain': return <BlockchainManagement searchQuery={searchQuery} />;
            case 'Team Management': return <TeamManagement searchQuery={searchQuery} />;
            case 'Reports': return <ReportsManagement userRole={UserRole.PARTNER} searchQuery={searchQuery} />;
            case 'Settings': return <PartnerSettings />;
            case 'Support': return <SupportManagement />;
            default: return <PartnerOverview />;
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
                    <NavItemLink icon={<TransactionsIcon />} label="Transactions" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<BriefcaseIcon />} label="Settlements" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<UsersIcon />} label="Team Management" activeItem={activeView} setItem={navigateTo} />
                    
                    <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform</p>
                    <NavItemLink icon={<CodeIcon />} label="API Management" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<CubeIcon />} label="Blockchain" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<AnalyticsIcon />} label="Reports" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<SettingsIcon />} label="Settings" activeItem={activeView} setItem={navigateTo} />
                    <NavItemLink icon={<SupportIcon />} label="Support" activeItem={activeView} setItem={navigateTo} />
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

export default PartnerDashboard;