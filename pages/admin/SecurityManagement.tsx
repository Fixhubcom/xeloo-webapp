
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { UserRole } from '../../types';

type Permission = 
    | 'view_dashboard'
    | 'send_payments'
    | 'manage_invoices'
    | 'manage_payroll'
    | 'view_reports'
    | 'manage_api_keys'
    | 'manage_team_members'
    | 'approve_settlements'
    | 'manage_users'
    | 'manage_platform_settings';

const permissionsMap: { [key in Permission]: string } = {
    view_dashboard: 'View Dashboard & Analytics',
    send_payments: 'Send Payments',
    manage_invoices: 'Manage Invoices',
    manage_payroll: 'Manage Payroll',
    view_reports: 'View & Export Reports',
    manage_api_keys: 'Manage API Keys',
    manage_team_members: 'Manage Team Members',
    approve_settlements: 'Approve Settlements',
    manage_users: 'Manage All Users',
    manage_platform_settings: 'Manage Platform Settings',
};

const rolePermissions: { [key in UserRole]: Permission[] } = {
    [UserRole.USER]: ['view_dashboard', 'send_payments', 'manage_invoices', 'manage_payroll', 'view_reports', 'manage_api_keys'],
    [UserRole.MERCHANT]: ['view_dashboard', 'view_reports', 'manage_team_members', 'manage_api_keys'],
    [UserRole.PARTNER]: ['view_dashboard', 'approve_settlements', 'view_reports', 'manage_api_keys', 'manage_team_members'],
    [UserRole.ADMIN]: Object.keys(permissionsMap) as Permission[],
};


const PermissionsModal: React.FC<{ role: UserRole; onClose: () => void; }> = ({ role, onClose }) => {
    const [permissions, setPermissions] = useState(rolePermissions[role]);

    const togglePermission = (permission: Permission) => {
        setPermissions(prev => 
            prev.includes(permission) ? prev.filter(p => p !== permission) : [...prev, permission]
        );
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
            <Card className="w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Manage Permissions for <span className="text-accent">{role}</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                    {Object.entries(permissionsMap).map(([key, label]) => (
                        <div key={key} className="flex items-center p-3 bg-primary rounded-md">
                            <input 
                                id={`perm-${key}`} 
                                type="checkbox"
                                checked={permissions.includes(key as Permission)}
                                onChange={() => togglePermission(key as Permission)}
                                className="h-5 w-5 rounded border-gray-300 text-accent focus:ring-accent" 
                            />
                            <label htmlFor={`perm-${key}`} className="ml-3 text-white">{label}</label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                    <button onClick={onClose} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">Save Permissions</button>
                </div>
            </Card>
        </div>
    );
};


const SecurityManagement: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

    const openModal = (role: UserRole) => {
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRole(null);
    };

    const roles = [
        { role: UserRole.ADMIN, description: "Full access to all platform features and settings." },
        { role: UserRole.PARTNER, description: "Access to transaction data, settlements, and API keys." },
        { role: UserRole.MERCHANT, description: "Manages asset listings, tracks sales, and handles payouts." },
        { role: UserRole.USER, description: "Standard user account for sending and receiving payments." },
    ];

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-xl font-bold mb-4">Roles & Permissions</h2>
                <p className="text-gray-400 mb-6">Define roles and manage fine-grained permissions for each user type on the platform.</p>
                <div className="space-y-3">
                    {roles.map(({ role, description }) => (
                         <div key={role} className="flex justify-between items-center p-3 bg-primary rounded-md">
                            <div>
                                <h3 className="font-semibold text-white">{role}</h3>
                                <p className="text-sm text-gray-400">{description}</p>
                            </div>
                            <button onClick={() => openModal(role)} className="font-medium text-accent hover:underline text-sm">Manage Permissions</button>
                        </div>
                    ))}
                </div>
            </Card>

            {isModalOpen && selectedRole && <PermissionsModal role={selectedRole} onClose={closeModal} />}

            <Card>
                <h2 className="text-xl font-bold mb-4">Platform Security Policies</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-white">Password Policy</h3>
                        <p className="text-gray-400 text-sm mt-1">Enforce password complexity and expiration rules. (e.g., minimum 8 characters, one uppercase, one number, etc.)</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Account Lockout Policy</h3>
                        <p className="text-gray-400 text-sm mt-1">Set thresholds for failed login attempts to prevent brute-force attacks.</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-white">Security Logs & Auditing</h3>
                        <p className="text-gray-400 text-sm mt-1">Review a detailed audit trail of all administrative actions and security events.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SecurityManagement;