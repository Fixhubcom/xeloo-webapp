
import React, { useState } from 'react';
import Card from '../../components/common/Card';

interface ApiKey {
    id: string;
    key: string;
    userName: string;
    userType: 'Partner' | 'Merchant';
    status: 'Active' | 'Revoked';
    created: string;
}

const mockApiKeys: ApiKey[] = [
    { id: 'key_1', key: 'xel_sk_test_************************3c4d', userName: 'Global Bank', userType: 'Partner', status: 'Active', created: '2023-01-20' },
    { id: 'key_2', key: 'xel_sk_test_************************a1b2', userName: 'Digital Assets LLC', userType: 'Merchant', status: 'Active', created: '2023-05-22' },
    { id: 'key_3', key: 'xel_sk_test_************************9f8e', userName: 'Africa Payouts Ltd', userType: 'Partner', status: 'Revoked', created: '2022-11-10' },
];

const AdminApiManagement: React.FC = () => {
    const [apiKeys, setApiKeys] = useState(mockApiKeys);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center"><h3 className="text-lg text-gray-400">API Requests (24h)</h3><p className="text-3xl font-bold text-accent">1.2M</p></Card>
                <Card className="text-center"><h3 className="text-lg text-gray-400">API Uptime</h3><p className="text-3xl font-bold text-green-400">99.99%</p></Card>
                <Card className="text-center"><h3 className="text-lg text-gray-400">Error Rate</h3><p className="text-3xl font-bold text-yellow-400">0.02%</p></Card>
            </div>
            <Card>
                <h2 className="text-xl font-bold mb-4">API Key Management</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-primary">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Key (Secret)</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apiKeys.map(key => (
                                <tr key={key.id} className="bg-primary-light border-b border-primary">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{key.userName}</div>
                                        <div className="text-xs">{key.userType}</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{key.key}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${key.status === 'Active' ? 'bg-accent/20 text-accent' : 'bg-gray-500/20 text-gray-300'}`}>{key.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {key.status === 'Active' && <button className="font-medium text-red-400 hover:underline">Revoke</button>}
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

export default AdminApiManagement;