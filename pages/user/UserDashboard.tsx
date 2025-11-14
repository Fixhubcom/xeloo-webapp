import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import Avatar from '../../components/common/Avatar';
import HelpWidget from '../../components/common/HelpWidget';
import { useTheme } from '../../context/ThemeContext';
import { User, UserRole } from '../../types';
import { DashboardIcon, SendIcon, PayrollIcon, InvoiceIcon, LogoutIcon, TransactionsIcon, ConverterIcon, AccountingIcon, SettingsIcon, SearchIcon, SunIcon, MoonIcon, RefreshIcon, LockIcon, CodeIcon, SubscriptionIcon, AnalyticsIcon, SupportIcon, ShieldCheckIcon, BriefcaseIcon, UsersIcon, MenuIcon, ArrowLeftIcon } from '../../components/icons/Icons';
import UserAnalytics from './UserAnalytics';
import SendPayment from './SendPayment';
import Transactions from './Transactions';
import Invoices from './Invoices';
import CurrencyConverter from './CurrencyConverter';
import Accounting from './Accounting';
import Settings from './Settings';
import RecurringPayments from './RecurringPayments';
import ApiManagement from './ApiManagement';
import SubscriptionPage from './SubscriptionPage';
import ReportsManagement from '../ReportsManagement';
import SupportManagement from '../SupportManagement';
import Payroll from './Payroll';
import UpgradePrompt from '../../components/common/UpgradePrompt';
import Escrow from './Escrow';
import Directory from './Directory';
import TaxPayments from './TaxPayments';

type NavItem = 'Dashboard' | 'Send Payment' | 'Recurring Payments' | 'Transactions' | 'Invoices' | 'Payroll' | 'Escrow' | 'Tax Payments' | 'Currency Converter' | 'Accounting' | 'API Management' | 'Subscription' | 'Settings' | 'Reports' | 'Support' | 'Directory';

const UserDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [history, setHistory] = useState<{ view: NavItem, props?: any }[]>([{ view: 'Transactions', props: {} }]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const pageState = history[history.length - 1];

    const navigateTo = (view: NavItem, props: any = {}) => {
        setHistory(prev => [...prev, { view, props }]);
        setIsSidebarOpen(false);
    };
    
    const selectSidebarItem = (view: NavItem) => {
        setHistory([{ view, props: {} }]);
        setIsSidebarOpen(false);
    }
    
    const goBack = () => {
        if (history.length > 1) {
            setHistory(prev => prev.slice(0, -1));
        }
    };

    const renderContent = () => {
        const { view, props } = pageState;
        switch (view) {
            case 'Dashboard': return <UserAnalytics />;
            case 'Send Payment': return <SendPayment {...props} />;
            case 'Recurring Payments': return <RecurringPayments searchQuery={searchQuery} />;
            case 'Transactions': return <Transactions searchQuery={searchQuery} />;
            case 'Invoices':
                return user?.isSubscribed ? <Invoices searchQuery={searchQuery} /> : <UpgradePrompt featureName="Invoicing" onUpgrade={() => selectSidebarItem('Subscription')} />;
            case 'Payroll':
                return user?.isSubscribed ? <Payroll searchQuery={searchQuery} /> : <UpgradePrompt featureName="Payroll" onUpgrade={() => selectSidebarItem('Subscription')} />;
            case 'Escrow': return <Escrow searchQuery={searchQuery} {...props} />;
            case 'Tax Payments': return <TaxPayments />;
            case 'Currency Converter': return <CurrencyConverter />;
            case 'Accounting':
                return user?.isSubscribed ? <Accounting searchQuery={searchQuery} /> : <UpgradePrompt featureName="Accounting" onUpgrade={() => selectSidebarItem('Subscription')} />;
            case 'API Management':
                return <ApiManagement />;
            case 'Subscription': return <SubscriptionPage />;
            case 'Settings': return <Settings />;
            case 'Reports': return <ReportsManagement userRole={user!.role} searchQuery={searchQuery} />;
            case 'Support': return <SupportManagement />;
            case 'Directory': return <Directory navigateTo={navigateTo} />;
            default: return <UserAnalytics />;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-primary overflow-hidden">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-white dark:bg-primary flex flex-col shadow-lg fixed z-30 inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0`}>
                <div className="h-20 flex items-center justify-center border-b border-gray-200 dark:border-primary-light">
                    <Logo className="text-3xl" />
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
                    <NavItemLink icon={<DashboardIcon />} label="Dashboard" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    <NavItemLink icon={<SendIcon />} label="Send Payment" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    <NavItemLink icon={<RefreshIcon />} label="Recurring Payments" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    <NavItemLink icon={<TransactionsIcon />} label="Transactions" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    <NavItemLink icon={<InvoiceIcon />} label="Invoices" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} isLocked={!user?.isSubscribed} />
                    <NavItemLink icon={<PayrollIcon />} label="Payroll" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} isLocked={!user?.isSubscribed} />
                    <NavItemLink icon={<ShieldCheckIcon />} label="Escrow" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    
                    <p className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tools</p>
                    <NavItemLink icon={<ConverterIcon />} label="Currency Converter" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    <NavItemLink icon={<UsersIcon />} label="Directory" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    {user?.bankAccounts?.some(acc => acc.currency === 'NGN') && (
                        <NavItemLink icon={<BriefcaseIcon />} label="Tax Payments" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    )}
                    <NavItemLink icon={<AccountingIcon />} label="Accounting" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} isLocked={!user?.isSubscribed} />
                    <NavItemLink icon={<AnalyticsIcon />} label="Reports" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    <NavItemLink icon={<CodeIcon />} label="API Management" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    <NavItemLink icon={<SubscriptionIcon />} label="Subscription" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    <NavItemLink icon={<SupportIcon />} label="Support" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                    <NavItemLink icon={<SettingsIcon />} label="Settings" activeItem={pageState.view} selectSidebarItem={selectSidebarItem} />
                </nav>
                <div className="px-4 py-4 border-t border-gray-200 dark:border-primary-light">
                    <button onClick={logout} className="w-full flex items-center px-4 py-2 text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-primary-light hover:text-slate-800 dark:hover:text-white rounded-md transition-colors">
                        <LogoutIcon className="mr-3 w-5 h-5"/>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-20 bg-white dark:bg-primary flex items-center justify-between px-4 sm:px-8 border-b border-gray-200 dark:border-primary-light flex-shrink-0">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 dark:text-gray-400 focus:outline-none">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                         {history.length > 1 && (
                            <button onClick={goBack} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-primary-light">
                                <ArrowLeftIcon className="w-5 h-5" />
                            </button>
                        )}
                        <div className="relative hidden md:block">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-100 dark:bg-primary-light border border-gray-300 dark:border-primary-light rounded-md py-2 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-accent focus:border-accent w-64 lg:w-96"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-primary-light md:hidden">
                            <SearchIcon className="w-6 h-6" />
                        </button>
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-primary-light">
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
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 dark:bg-dark-green">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">{pageState.view}</h1>
                    {renderContent()}
                </div>
                <HelpWidget />
            </main>
        </div>
    );
}

interface NavItemLinkProps {
  icon: React.ReactElement<{ className?: string }>;
  label: NavItem;
  activeItem: NavItem;
  selectSidebarItem: (item: NavItem) => void;
  isLocked?: boolean;
}

const NavItemLink: React.FC<NavItemLinkProps> = ({ icon, label, activeItem, selectSidebarItem, isLocked }) => {
  const isActive = activeItem === label;
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      selectSidebarItem(label);
  }

  return (
    <a
      href="#"
      onClick={handleClick}
      className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-accent text-primary'
          : 'text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-primary-light hover:text-slate-800 dark:hover:text-white'
      }`}
    >
        <div className="flex items-center">
            {React.cloneElement(icon, { className: 'w-5 h-5' })}
            <span className="ml-3">{label}</span>
        </div>
      {isLocked && <LockIcon className="w-4 h-4 text-yellow-400/70" />}
    </a>
  );
};


export default UserDashboard;