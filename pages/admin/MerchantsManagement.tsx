import React from 'react';
import Card from '../../components/common/Card';

interface MockMerchant {
    id: string;
    name: string;
    email: string;
    companyName: string;
    status: 'Approved' | 'Pending Review' | 'Suspended';
    joinedDate: string;
    totalSales: number;
}

const mockMerchants: MockMerchant[] = [
    { id: '3', name: 'Crypto Merchant', email: 'sales@digitalassets.com', companyName: 'Digital Assets LLC', status: 'Approved', joinedDate: '2023-05-20', totalSales: 185000 },
    { id: '6', name: 'Global Goods', email: 'contact@globalgoods.com', companyName: 'Global Goods Ltd.', status: 'Approved', joinedDate: '2023-08-11', totalSales: 250000 },
    { id: '7', name: 'Nairobi Novelties', email: 'sales@nairobino.co.ke', companyName: 'Nairobi Novelties', status: 'Pending Review', joinedDate: '2024-07-10', totalSales: 0 },
    { id: '8', name: 'Accra Arts', email: 'info@accraarts.gh', companyName: 'Accra Arts & Crafts', status: 'Suspended', joinedDate: '2023-02-01', totalSales: 50000 },
];

const StatusBadge: React.FC<{ status: MockMerchant['status'] }> = ({ status }) => {
    const statusClasses = {
        'Approved': "bg-accent/20 text-accent",
        'Pending Review': "bg-yellow-500/20 text-yellow-300",
        'Suspended': "bg-red-500/20 text-red-300",
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusClasses[status]}`}>{status}</span>;
};


const MerchantsManagement: React.FC = () => {
    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-white">Merchant Management</h2>
                 <button className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">
                     Add New Merchant
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-primary">
                        <tr>
                            <th className="px-6 py-3">Merchant</th>
                            <th className="px-6 py-3">Company</th>
                            <th className="px-6 py-3">Joined Date</th>
                            <th className="px-6 py-3 text-right">Total Sales (USD)</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockMerchants.map(merchant => (
                            <tr key={merchant.id} className="bg-primary-light border-b border-primary">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{merchant.name}</div>
                                    <div className="text-xs">{merchant.email}</div>
                                </td>
                                <td className="px-6 py-4">{merchant.companyName}</td>
                                <td className="px-6 py-4">{merchant.joinedDate}</td>
                                <td className="px-6 py-4 font-mono text-right">${merchant.totalSales.toLocaleString()}</td>
                                <td className="px-6 py-4"><StatusBadge status={merchant.status} /></td>
                                <td className="px-6 py-4 space-x-2">
                                     <button className="font-medium text-accent hover:underline text-xs">Edit</button>
                                     <button className="font-medium text-accent hover:underline text-xs">View Listings</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default MerchantsManagement;
