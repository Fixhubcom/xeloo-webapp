import React from 'react';
import Card from '../../components/common/Card';

const SecurityManagement: React.FC = () => {
    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-xl font-bold mb-4">Roles & Permissions</h2>
                <p className="text-gray-light mb-6">Define roles and manage fine-grained permissions for each user type on the platform.</p>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-primary rounded-md">
                        <div>
                            <h3 className="font-semibold text-white">Super Admin</h3>
                            <p className="text-sm text-gray-400">Full access to all platform features and settings.</p>
                        </div>
                        <button className="font-medium text-accent hover:underline text-sm">Manage Permissions</button>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-primary rounded-md">
                        <div>
                            <h3 className="font-semibold text-white">Financial Partner</h3>
                            <p className="text-sm text-gray-400">Access to transaction data, settlements, and API keys.</p>
                        </div>
                        <button className="font-medium text-accent hover:underline text-sm">Manage Permissions</button>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-primary rounded-md">
                        <div>
                            <h3 className="font-semibold text-white">Merchant</h3>
                            <p className="text-sm text-gray-400">Manages asset listings, tracks sales, and handles payouts.</p>
                        </div>
                        <button className="font-medium text-accent hover:underline text-sm">Manage Permissions</button>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-primary rounded-md">
                        <div>
                            <h3 className="font-semibold text-white">User</h3>
                            <p className="text-sm text-gray-400">Standard user account for sending and receiving payments.</p>
                        </div>
                        <button className="font-medium text-accent hover:underline text-sm">Manage Permissions</button>
                    </div>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4">Platform Security Policies</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-white">Password Policy</h3>
                        <p className="text-gray-light text-sm mt-1">Enforce password complexity and expiration rules. (e.g., minimum 8 characters, one uppercase, one number, etc.)</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Account Lockout Policy</h3>
                        <p className="text-gray-light text-sm mt-1">Set thresholds for failed login attempts to prevent brute-force attacks.</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-white">Security Logs & Auditing</h3>
                        <p className="text-gray-light text-sm mt-1">Review a detailed audit trail of all administrative actions and security events.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SecurityManagement;
