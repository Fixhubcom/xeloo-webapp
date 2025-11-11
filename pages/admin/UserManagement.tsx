import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { UserRole, UserSubRole } from '../../types';

interface MockUser {
    id: string;
    name: string;
    email: string;
    companyName: string;
    role: UserRole;
    subRole?: UserSubRole;
    status: 'Active' | 'Pending' | 'Deactivated' | 'Rejected';
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
        Rejected: "bg-red-500/20 text-red-300",
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusClasses[status]}`}>{status}</span>;
};


const EditUserModal: React.FC<{
    user: MockUser;
    onClose: () => void;
    onSave: (updatedUser: MockUser) => void;
}> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<MockUser>(user);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
            <Card className="w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Edit User: <span className="text-accent">{user.name}</span></h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Company Name</label>
                        <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-400">Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-primary-light mt-1">
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Deactivated">Deactivated</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Account Officer</label>
                            <select name="accountOfficerId" value={formData.accountOfficerId || ''} onChange={handleInputChange} disabled={formData.role === UserRole.ADMIN} className="w-full bg-primary p-2 rounded border border-primary-light mt-1 disabled:opacity-50">
                                <option value="">Unassigned</option>
                                {accountOfficers.map(officer => <option key={officer.id} value={officer.id}>{officer.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSave} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Save Changes</button>
                </div>
            </Card>
        </div>
    );
};

const UserDetailsModal: React.FC<{ user: MockUser; onClose: () => void; }> = ({ user, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">User Details</h2>
                        <p className="font-mono text-sm text-gray-400">ID: {user.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="bg-primary p-4 rounded-lg space-y-3">
                        <div><p className="text-gray-400">Name</p><p className="font-semibold text-white">{user.name}</p></div>
                        <div><p className="text-gray-400">Email</p><p className="font-semibold text-white">{user.email}</p></div>
                        <div><p className="text-gray-400">Company</p><p className="font-semibold text-white">{user.companyName}</p></div>
                    </div>
                    <div className="bg-primary p-4 rounded-lg space-y-3">
                        <div><p className="text-gray-400">Role</p><p className="font-semibold text-white">{user.role}</p></div>
                        <div><p className="text-gray-400">Sub-Role</p><p className="font-semibold text-white">{user.subRole || 'N/A'}</p></div>
                        <div><p className="text-gray-400">Account Officer</p><p className="font-semibold text-white">{accountOfficers.find(ao => ao.id === user.accountOfficerId)?.name || 'Unassigned'}</p></div>
                        <div><p className="text-gray-400">Status</p><p><StatusBadge status={user.status} /></p></div>
                    </div>
                </div>
                 <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Close</button>
                </div>
            </Card>
        </div>
    );
};

interface UserManagementProps {
    searchQuery: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ searchQuery }) => {
    const [users, setUsers] = useState(mockUsers);
    const [onboardingLink, setOnboardingLink] = useState('');
    const [linkEmail, setLinkEmail] = useState('');
    const [linkRole, setLinkRole] = useState<'PARTNER' | 'MERCHANT'>('PARTNER');
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<MockUser | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState<MockUser | null>(null);


    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const lowercasedQuery = searchQuery.toLowerCase();
        return users.filter(u => 
            u.name.toLowerCase().includes(lowercasedQuery) ||
            u.email.toLowerCase().includes(lowercasedQuery) ||
            u.companyName.toLowerCase().includes(lowercasedQuery)
        );
    }, [users, searchQuery]);

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

    const handleEditClick = (user: MockUser) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };
    
    const handleViewDetailsClick = (user: MockUser) => {
        setViewingUser(user);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setViewingUser(null);
    };


    const handleSaveUser = (updatedUser: MockUser) => {
        setUsers(currentUsers =>
            currentUsers.map(u => (u.id === updatedUser.id ? updatedUser : u))
        );
        handleCloseModal();
    };
    
    const handleStatusChange = (userId: string, newStatus: 'Active' | 'Rejected') => {
        setUsers(currentUsers =>
            currentUsers.map(u => u.id === userId ? { ...u, status: newStatus } : u)
        );
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
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="bg-primary-light border-b border-primary">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{user.name}</div>
                                        <div className="text-xs text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">{user.companyName}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4">{user.subRole || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        {user.role !== UserRole.ADMIN
                                            ? accountOfficers.find(ao => ao.id === user.accountOfficerId)?.name || <span className="text-gray-500">Unassigned</span>
                                            : 'N/A'
                                        }
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-4 space-x-2 whitespace-nowrap text-center">
                                        {user.status === 'Pending' ? (
                                            <>
                                                <button onClick={() => handleStatusChange(user.id, 'Active')} className="font-medium text-green-400 hover:underline text-xs">Approve</button>
                                                <button onClick={() => handleStatusChange(user.id, 'Rejected')} className="font-medium text-red-400 hover:underline text-xs">Reject</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditClick(user)} className="font-medium text-accent hover:underline text-xs">Edit</button>
                                                <button onClick={() => handleViewDetailsClick(user)} className="font-medium text-accent hover:underline text-xs">View Details</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-400">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            {isEditModalOpen && editingUser && (
                <EditUserModal 
                    user={editingUser}
                    onClose={handleCloseModal}
                    onSave={handleSaveUser}
                />
            )}
            {isDetailsModalOpen && viewingUser && (
                <UserDetailsModal
                    user={viewingUser}
                    onClose={handleCloseDetailsModal}
                />
            )}
        </div>
    );
};

export default UserManagement;