
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import Avatar from '../../components/common/Avatar';
import HelpWidget from '../../components/common/HelpWidget';
import { useTheme } from '../../context/ThemeContext';
import { User } from '../../types';
import { DashboardIcon, SendIcon, PayrollIcon, InvoiceIcon, LogoutIcon, TransactionsIcon, ConverterIcon, AccountingIcon, SettingsIcon, SearchIcon, SunIcon, MoonIcon, RefreshIcon } from '../../components/icons/Icons';
import UserAnalytics from './UserAnalytics';
import SendPayment from './SendPayment';
import Transactions from './Transactions';
import Invoices from './Invoices';
import CurrencyConverter from './CurrencyConverter';
import Accounting from './Accounting';
import Settings from './Settings';
import RecurringPayments from './RecurringPayments';

// Mock content components
const Payroll: React.FC = () => <div className="text-gray-900 dark:text-white p-4">Payroll Management Page</div>;

type NavItem = 'Dashboard' | 'Send Payment' | 'Recurring Payments' | 'Transactions' | 'Invoices' | 'Payroll' | 'Currency Converter' | 'Accounting' | 'Settings';

const UserDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [activeView, setActiveView] = useState<NavItem>('Dashboard');
    const [searchQuery, setSearchQuery] = useState('');

    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard': return <UserAnalytics />;
            case 'Send Payment': return <SendPayment />;
            case 'Recurring Payments': return <RecurringPayments />;
            case 'Transactions': return <Transactions searchQuery={searchQuery} />;
            case 'Invoices': return <Invoices />;
            case 'Payroll': return <Payroll />;
            case 'Currency Converter': return <CurrencyConverter />;
            case 'Accounting': return <Accounting />;
            case 'Settings': return <Settings />;
            default: return <UserAnalytics />;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-dark">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-primary flex flex-col shadow-lg">
                <div className="h-20 flex items-center justify-center border-b border-gray-200 dark:border-primary-light">
                    <Logo className="text-3xl" />
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
                    <NavItemLink icon={<DashboardIcon />} label="Dashboard" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<SendIcon />} label="Send Payment" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<RefreshIcon />} label="Recurring Payments" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<TransactionsIcon />} label="Transactions" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<InvoiceIcon />} label="Invoices" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<PayrollIcon />} label="Payroll" activeItem={activeView} setItem={setActiveView} />
                    
                    <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tools</p>
                    <NavItemLink icon={<ConverterIcon />} label="Currency Converter" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<AccountingIcon />} label="Accounting" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<SettingsIcon />} label="Settings" activeItem={activeView} setItem={setActiveView} />
                </nav>
                <div className="px-4 py-4 border-t border-gray-200 dark:border-primary-light">
                    <button onClick={logout} className="w-full flex items-center px-4 py-2 text-gray-500 dark:text-gray-light hover:bg-gray-100 dark:hover:bg-primary-light hover:text-gray-900 dark:hover:text-white rounded-md transition-colors">
                        <LogoutIcon className="mr-3"/>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-20 bg-white dark:bg-primary flex items-center justify-between px-8 border-b border-gray-200 dark:border-primary-light">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search transactions by recipient..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-100 dark:bg-primary-light border border-gray-300 dark:border-gray-medium rounded-md py-2 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent w-96"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-dark">
                            {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-700" />}
                        </button>
                        <div className="flex items-center space-x-3">
                            <Avatar 
                                initials={user?.avatarInitials || ''}
                                bgColor={user?.avatarBgColor || '#ccc'}
                                className="w-10 h-10 text-lg"
                            />
                            <div className="text-right">
                                <p className="font-semibold text-gray-900 dark:text-white">{(user as User)?.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-light">{(user as User)?.companyName}</p>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-gray-dark">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{activeView}</h1>
                    {renderContent()}
                </div>
                <HelpWidget />
            </main>
        </div>
    );
}

interface NavItemLinkProps {
  // FIX: Changed icon prop type from React.ReactNode to a more specific React.ReactElement that accepts a className. This allows React.cloneElement to correctly pass props without a type error.
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
          : 'text-gray-500 dark:text-gray-light hover:bg-gray-100 dark:hover:bg-primary-light hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
      <span className="ml-3">{label}</span>
    </a>
  );
};


export default UserDashboard;