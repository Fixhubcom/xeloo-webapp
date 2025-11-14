
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
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';

type NavItem = 'Dashboard' | 'Send Payment' | 'Recurring Payments' | 'Transactions' | 'Invoices' | 'Payroll' | 'Escrow' | 'Tax Payments' | 'Currency Converter' | 'Accounting' | 'API Management' | 'Subscription' | 'Settings' | 'Reports' | 'Support' | 'Directory';

const AddFundsModal: React.FC<{ onClose: () => void, onFund: (amount: number) => void }> = ({ onClose, onFund }) => {
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

    const handleConfirmDeposit = () => {
        setStep('processing');
        setTimeout(() => {
            onFund(parseFloat(amount));
            setStep('success');
        }, 2000);
    };

    return (
         <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-md" onClick={e => e.stopPropagation()}>
                {step === 'form' && (
                    <>
                        <h2 className="text-2xl font-bold mb-2">Add Funds to Your Wallet</h2>
                        <p className="text-gray-400 mb-4">Deposit funds into the unique account below. The funds will be credited to your Xeloo balance instantly.</p>
                        <div>
                            <label className="text-sm text-gray-400">Amount (USD)</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full mt-1 bg-primary p-2 rounded border border-primary-light" required/>
                        </div>
                        <div className="bg-primary p-4 rounded-lg space-y-3 mt-4">
                            <div className="flex justify-between"><span className="text-gray-400">Bank Name:</span> <strong className="text-white">Xeloo Pay-In (Providus)</strong></div>
                            <div className="flex justify-between"><span className="text-gray-400">Account Number:</span> <strong className="font-mono text-white">9{Math.floor(100000000 + Math.random() * 900000000)}</strong></div>
                            <div className="flex justify-between"><span className="text-gray-400">Beneficiary:</span> <strong className="text-white">XELOO/{Math.random().toString(36).substring(2, 8).toUpperCase()}</strong></div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                            <button onClick={handleConfirmDeposit} disabled={!amount} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 disabled:bg-gray-500">I've Made the Deposit</button>
                        </div>
                    </>
                )}
                {step === 'processing' && (
                    <div className="text-center py-8">
                        <Spinner className="w-12 h-12 mx-auto border-4" />
                        <h2 className="text-2xl font-bold mt-4">Confirming Deposit...</h2>
                    </div>
                )}
                 {step === 'success' && (
                    <div className="text-center py-8">
                        <h2 className="text-2xl font-bold text-accent mb-2">Funds Added!</h2>
                        <p className="text-gray-300 mb-6">{parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been added to your wallet.</p>
                        <button onClick={onClose} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Done</button>
                    </div>
                )}
            </Card>
        </div>
    );
};


const UserDashboard: React.FC = () => {
    const { user, logout, updateWalletBalance } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [history, setHistory] = useState<{ view: NavItem, props?: any }[]>([{ view: 'Transactions', props: {} }]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);

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
    
    const handleFund = (amount: number) => {
        updateWalletBalance(amount);
    }

    const renderContent = () => {
        const { view, props } = pageState;
        const sharedProps = { openAddFundsModal: () => setIsAddFundsModalOpen(true) };
        switch (view) {
            case 'Dashboard': return <UserAnalytics />;
            case 'Send Payment': return <SendPayment {...props} {...sharedProps} />;
            case 'Recurring Payments': return <RecurringPayments searchQuery={searchQuery} />;
            case 'Transactions': return <Transactions searchQuery={searchQuery} />;
            case 'Invoices':
                return user?.isSubscribed ? <Invoices searchQuery={searchQuery} /> : <UpgradePrompt featureName="Invoicing" onUpgrade={() => selectSidebarItem('Subscription')} />;
            case 'Payroll':
                return user?.isSubscribed ? <Payroll searchQuery={searchQuery} {...sharedProps} /> : <UpgradePrompt featureName="Payroll" onUpgrade={() => selectSidebarItem('Subscription')} />;
            case 'Escrow': return <Escrow searchQuery={searchQuery} {...props} {...sharedProps} />;
            case 'Tax Payments': return <TaxPayments {...sharedProps} />;
            case 'Currency Converter': return <CurrencyConverter />;
            case 'Accounting':
                return user?.isSubscribed ? <Accounting searchQuery={searchQuery} {...sharedProps} /> : <UpgradePrompt featureName="Accounting" onUpgrade={() => selectSidebarItem('Subscription')} />;
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
                        <div className="bg-primary-light p-2 rounded-lg text-center hidden sm:block">
                            <div className="text-xs text-gray-400">Wallet Balance</div>
                            <div className="font-bold text-white">{(user?.walletBalance ?? 0).toLocaleString('en-US', { style: 'currency', currency: user?.preferredCurrency || 'USD' })}</div>
                        </div>
                         <button onClick={() => setIsAddFundsModalOpen(true)} className="bg-accent text-primary text-sm font-bold py-2 px-3 rounded-md hover:opacity-90">
                            + Add Funds
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
                            <div className="text-right hidden md:block">
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
            {isAddFundsModalOpen && <AddFundsModal onClose={() => setIsAddFundsModalOpen(false)} onFund={handleFund} />}
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