
import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';

interface MockPartner {
    id: string;
    name: string;
    contactEmail: string;
    status: 'Approved' | 'Pending KYB' | 'Rejected';
    joinedDate: string;
    totalVolume: number;
}

const mockPartners: MockPartner[] = [
    { id: '2', name: 'Global Bank', contactEmail: 'contact@globalbank.com', status: 'Approved', joinedDate: '2023-01-15', totalVolume: 12500000 },
    { id: '9', name: 'Africa Payouts Ltd', contactEmail: 'ops@africapayouts.com', status: 'Approved', joinedDate: '2022-11-05', totalVolume: 25000000 },
    { id: '10', name: 'SA Financials', contactEmail: 'admin@safin.co.za', status: 'Pending KYB', joinedDate: '2024-06-20', totalVolume: 0 },
    { id: '11', name: 'EU Payments Corp', contactEmail: 'compliance@eupay.com', status: 'Rejected', joinedDate: '2024-05-01', totalVolume: 0 },
];

const StatusBadge: React.FC<{ status: MockPartner['status'] }> = ({ status }) => {
    const statusClasses = {
        'Approved': "bg-accent/20 text-accent",
        'Pending KYB': "bg-yellow-500/20 text-yellow-300",
        'Rejected': "bg-red-500/20 text-red-300",
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusClasses[status]}`}>{status}</span>;
};

interface PartnersManagementProps {
    searchQuery: string;
}

const PartnersManagement: React.FC<PartnersManagementProps> = ({ searchQuery }) => {
    const [partners] = useState(mockPartners);

    const filteredPartners = useMemo(() => {
        if (!searchQuery) return partners;
        const lowercasedQuery = searchQuery.toLowerCase();
        return partners.filter(p => 
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.contactEmail.toLowerCase().includes(lowercasedQuery)
        );
    }, [partners, searchQuery]);

    return (
        <Card>
             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-white">Financial Partner Management</h2>
                 <button className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">
                     Onboard New Partner
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-primary">
                        <tr>
                            <th className="px-6 py-3">Partner Name</th>
                            <th className="px-6 py-3">Contact Email</th>
                            <th className="px-6 py-3">Joined Date</th>
                            <th className="px-6 py-3 text-right">Total Volume (USD)</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPartners.map(partner => (
                            <tr key={partner.id} className="bg-primary-light border-b border-primary">
                                <td className="px-6 py-4 font-medium text-white">{partner.name}</td>
                                <td className="px-6 py-4">{partner.contactEmail}</td>
                                <td className="px-6 py-4">{partner.joinedDate}</td>
                                <td className="px-6 py-4 font-mono text-right">${partner.totalVolume.toLocaleString()}</td>
                                <td className="px-6 py-4"><StatusBadge status={partner.status} /></td>
                                <td className="px-6 py-4 space-x-2">
                                     <button className="font-medium text-accent hover:underline text-xs">Edit</button>
                                     <button className="font-medium text-accent hover:underline text-xs">View Details</button>
                                </td>
                            </tr>
                        ))}
                        {filteredPartners.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-400">No partners found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default PartnersManagement;
