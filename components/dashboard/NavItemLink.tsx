
import React from 'react';
import { LockIcon } from '../icons/Icons';

// Since NavItem is specific to the Dashboard's state, we can either export it or keep it generic string
export type NavItem = 'Dashboard' | 'Send Payment' | 'Recurring Payments' | 'Transactions' | 'Invoices' | 'Payroll' | 'Escrow' | 'Tax Payments' | 'Currency Converter' | 'Accounting' | 'API Management' | 'Subscription' | 'Settings' | 'Reports' | 'Support' | 'Directory';

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

export default NavItemLink;
