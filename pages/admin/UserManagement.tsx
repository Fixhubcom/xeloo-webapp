
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { UserRole, UserSubRole } from '../../types';

interface MockUser {
    id: string;
    name: string;
    email: string;
    companyName: string;
    role: UserRole;
    subRole?: UserSubRole;
    status: 'Active' | 'Pending' | 'Deactivated';
    accountOfficerId?: string;
}

const mockUsers: MockUser[] = [
    { id: '1', name: 'John Doe', email: 'john@creativesolutions.com', companyName: 'Creative Solutions', role: UserRole.USER, subRole: UserSubRole.ADMINISTRATOR, status: 'Active', accountOfficerId: '7' },
    { id: '2', name: 'Financial Partner', email: 'contact@globalbank.com', companyName: 'Global Bank', role: UserRole.PARTNER, subRole: UserSubRole.ADMINISTRATOR, status: 'Active', accountOfficerId: '5' },
    { id: '3', name: 'Crypto Merchant', email: 'sales@digitalassets.com', companyName: 'Digital Assets LLC', role: UserRole.MERCHANT, subRole: UserSubRole.ADMINISTRATOR, status: 'Active', accountOfficerId: '5' },
    { id: '4', name: 'Jane Smith', email: 'jane.s@newbiz.co', companyName: 'NewBiz Co', role: UserRole.USER, subRole: UserSubRole.STANDARD, status: 'Pending' },
    { id: '5', name: 'Super Admin', email: 'admin@xeloo.com', companyName: 'Xeloo Corp', role: UserRole.ADMIN, status: 'Active' },
];

const accountOfficers = [
    { id: '5', name: 'Super Admin' },
    { id: '7', name: 'Support Lead' },
];

const StatusBadge: React.FC<{ status: MockUser['status'] }> = ({ status }) => {
    const statusClasses = {
        Active: "bg-accent/20 text-accent",
        Pending: "bg-yellow-500/20 text-yellow-300",
        Deactivated: "bg-gray-500/20 text-gray-300",
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusClasses[status]}`}>{status}</span>;
};

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState(mockUsers);
    const [onboardingLink, setOnboardingLink] = useState('');
    const [linkEmail, setLinkEmail] = useState('');
    const [linkRole, setLinkRole] = useState<'PARTNER' | 'MERCHANT'>('PARTNER');

    const handleGenerateLink = (e: React.FormEvent) => {
        e.preventDefault();
        const token = [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
        const generatedLink = `${window.location.origin}${window.location.pathname}#/onboarding?role=${linkRole}&email=${encodeURIComponent(linkEmail)}&token=${token}`;
        setOnboardingLink(generatedLink);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(onboardingLink);
        // Add a temporary visual feedback if desired
    };

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-xl font-bold mb-4">Generate Onboarding Link</h2>
                <p className="text-gray-400 mb-6">Create a unique sign-up link for a new Financial Partner or Merchant.</p>
                <form onSubmit={handleGenerateLink} className="flex flex-col md:flex-row items-end gap-4">
                    <div className="w-full">
                        <label className="text-sm text-gray-400">Prospective User's Email</label>
                        <input 
                            type="email" 
                            value={linkEmail}
                            onChange={(e) => setLinkEmail(e.target.value)}
                            placeholder="partner@example.com" 
                            required 
                            className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                    </div>
                     <div className="w-full md:w-auto">
                        <label className="text-sm text-gray-400">Role</label>
                        <select 
                            value={linkRole}
                            onChange={(e) => setLinkRole(e.target.value as 'PARTNER' | 'MERCHANT')}
                            className="w-full bg-primary p-2 rounded border border-primary-light mt-1"
                        >
                            <option value="PARTNER">Financial Partner</option>
                            <option value="MERCHANT">Merchant</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full md:w-auto bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Generate Link</button>
                </form>
                {onboardingLink && (
                    <div className="mt-4 bg-primary p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Share this secure link:</p>
                        <div className="flex items-center gap-4 mt-2">
                            <input type="text" readOnly value={onboardingLink} className="w-full bg-primary-light p-2 rounded border border-primary font-mono text-xs" />
                            <button onClick={copyLink} className="bg-primary-light text-white font-bold py-2 px-4 rounded hover:bg-opacity-90 text-sm">Copy</button>
                        </div>
                    </div>
                )}
            </Card>
            <Card>
                <h2 className="text-xl font-bold mb-4">User Management</h2>
                <p className="text-gray-400 mb-6">View, manage, and edit user roles and statuses across the platform.</p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-primary">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Company</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Sub-Role</th>
                                <th className="px-6 py-3">Account Officer</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-primary-light border-b border-primary">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{user.name}</div>
                                        <div className="text-xs text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">{user.companyName}</td>
                                    <td className="px-6 py-4">
                                        <select defaultValue={user.role} className="bg-primary border border-primary-light rounded-md py-1 px-2 text-xs text-accent focus:outline-none focus:ring-accent focus:border-accent">
                                            {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role !== UserRole.ADMIN ? (
                                            <select defaultValue={user.subRole || UserSubRole.STANDARD} className="bg-primary border border-primary-light rounded-md py-1 px-2 text-xs text-white focus:outline-none focus:ring-accent focus:border-accent">
                                                {Object.values(UserSubRole).map(subRole => <option key={subRole} value={subRole}>{subRole}</option>)}
                                            </select>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role !== UserRole.ADMIN && (
                                            <select 
                                                defaultValue={user.accountOfficerId || ''} 
                                                className="w-full bg-primary border border-primary-light rounded-md py-1 px-2 text-xs text-white focus:outline-none focus:ring-accent focus:border-accent"
                                            >
                                                <option value="">Unassigned</option>
                                                {accountOfficers.map(officer => (
                                                    <option key={officer.id} value={officer.id}>{officer.name}</option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-4">
                                        <button className="font-medium text-accent hover:underline">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default UserManagement;
