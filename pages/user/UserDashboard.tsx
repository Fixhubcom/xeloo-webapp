
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import { User } from '../../types';
import { DashboardIcon, SendIcon, PayrollIcon, InvoiceIcon, AnalyticsIcon, LogoutIcon } from '../../components/icons/Icons';
import UserAnalytics from './UserAnalytics';
import SendPayment from './SendPayment';

// Mock content components
const Payroll: React.FC = () => <div className="text-white p-4">Payroll Management Page</div>;
const Invoices: React.FC = () => <div className="text-white p-4">Invoicing System Page</div>;

type NavItem = 'Dashboard' | 'Send Payment' | 'Payroll' | 'Invoices';

const UserDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [activeView, setActiveView] = useState<NavItem>('Dashboard');

    const renderContent = () => {
        switch (activeView) {
            case 'Dashboard': return <UserAnalytics />;
            case 'Send Payment': return <SendPayment />;
            case 'Payroll': return <Payroll />;
            case 'Invoices': return <Invoices />;
            default: return <UserAnalytics />;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-dark">
            {/* Sidebar */}
            <aside className="w-64 bg-primary flex flex-col">
                <div className="h-20 flex items-center justify-center border-b border-primary-light">
                    <Logo className="text-3xl" />
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavItemLink icon={<DashboardIcon />} label="Dashboard" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<SendIcon />} label="Send Payment" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<PayrollIcon />} label="Payroll" activeItem={activeView} setItem={setActiveView} />
                    <NavItemLink icon={<InvoiceIcon />} label="Invoices" activeItem={activeView} setItem={setActiveView} />
                </nav>
                <div className="px-4 py-4 border-t border-primary-light">
                    <button onClick={logout} className="w-full flex items-center px-4 py-2 text-gray-light hover:bg-primary-light hover:text-white rounded-md transition-colors">
                        <LogoutIcon className="mr-3"/>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 bg-primary flex items-center justify-between px-8 border-b border-primary-light">
                    <h1 className="text-2xl font-bold text-white">{activeView}</h1>
                    <div className="text-right">
                        <p className="font-semibold text-white">{(user as User)?.name}</p>
                        <p className="text-sm text-gray-light">{(user as User)?.companyName}</p>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-8 bg-gray-dark">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

interface NavItemLinkProps {
  icon: React.ReactNode;
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
          : 'text-gray-light hover:bg-primary-light hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  );
};


export default UserDashboard;
