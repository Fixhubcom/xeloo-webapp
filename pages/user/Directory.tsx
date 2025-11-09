import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import { SearchIcon, SendIcon, ShieldCheckIcon } from '../../components/icons/Icons';
import { PublicUserProfile } from '../../types';

// This type definition is local to avoid circular dependencies
type UserDashboardNavItem = 'Dashboard' | 'Send Payment' | 'Recurring Payments' | 'Transactions' | 'Invoices' | 'Payroll' | 'Escrow' | 'Tax Payments' | 'Currency Converter' | 'Accounting' | 'API Management' | 'Subscription' | 'Settings' | 'Reports' | 'Support' | 'Directory';

interface DirectoryProps {
    navigateTo: (view: UserDashboardNavItem, props?: any) => void;
}

// Mock data for public user profiles
const mockPublicUsers: PublicUserProfile[] = [
  { id: '1', name: 'John Doe', username: 'johndoe', companyName: 'Creative Solutions', avatarInitials: 'JD', avatarBgColor: '#fdda1a' },
  { id: '2', name: 'Acme Inc.', username: 'acmeinc', companyName: 'Acme Incorporated', avatarInitials: 'AI', avatarBgColor: '#3b82f6' },
  { id: '3', name: 'Lagos Ventures', username: 'lagosventures', companyName: 'LV Capital', avatarInitials: 'LV', avatarBgColor: '#10b981' },
  { id: '4', name: 'Jane Smith', username: 'janesmith', companyName: 'NewBiz Co', avatarInitials: 'JS', avatarBgColor: '#ef4444' },
  { id: '5', name: 'Digital Exports', username: 'digitalexports', companyName: 'Digital Exports LLC', avatarInitials: 'DE', avatarBgColor: '#8b5cf6' },
];

const Directory: React.FC<DirectoryProps> = ({ navigateTo }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return mockPublicUsers;
        const lowercasedQuery = searchTerm.toLowerCase();
        return mockPublicUsers.filter(user => 
            user.name.toLowerCase().includes(lowercasedQuery) ||
            user.username.toLowerCase().includes(lowercasedQuery) ||
            user.companyName.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchTerm]);

    return (
        <div className="space-y-6">
            <Card>
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search for users or businesses by name, @username, or company..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-primary border border-primary-light rounded-md py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-accent focus:border-accent w-full"
                    />
                </div>
            </Card>

            {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map(user => (
                        <Card key={user.id}>
                            <div className="flex flex-col items-center text-center">
                                <Avatar 
                                    initials={user.avatarInitials}
                                    bgColor={user.avatarBgColor}
                                    className="w-20 h-20 text-3xl mb-4"
                                />
                                <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                <p className="text-accent">@{user.username}</p>
                                <p className="text-sm text-gray-400 mt-1">{user.companyName}</p>
                            </div>
                            <div className="mt-6 flex flex-col space-y-2">
                                <button 
                                    onClick={() => navigateTo('Send Payment', { initialUsername: user.username })}
                                    className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-primary bg-accent hover:opacity-90"
                                >
                                    <SendIcon className="w-4 h-4 mr-2"/>
                                    Send Payment
                                </button>
                                <button 
                                    onClick={() => navigateTo('Escrow', { initialSeller: user.username })}
                                    className="w-full flex items-center justify-center py-2 px-4 border border-primary-light rounded-md shadow-sm text-sm font-medium text-white bg-primary-light hover:bg-primary"
                                >
                                    <ShieldCheckIcon className="w-4 h-4 mr-2"/>
                                    Start Escrow
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <p className="text-gray-400">No users found for "{searchTerm}".</p>
                </Card>
            )}
        </div>
    );
};

export default Directory;