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
    { id: '12', name: 'ChinaPay', contactEmail: 'ops@chinapay.com', status: 'Approved', joinedDate: '2023-10-01', totalVolume: 15000000 },
];

const StatusBadge: React.FC<{ status: MockPartner['status'] }> = ({ status }) => {
    const statusClasses = {
        'Approved': "bg-accent/20 text-accent",
        'Pending KYB': "bg-yellow-500/20 text-yellow-300",
        'Rejected': "bg-red-500/20 text-red-300",
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusClasses[status]}`}>{status}</span>;
};

const EditPartnerModal: React.FC<{
    partner: MockPartner;
    onClose: () => void;
    onSave: (updatedPartner: MockPartner) => void;
}> = ({ partner, onClose, onSave }) => {
    const [formData, setFormData] = useState<MockPartner>(partner);

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
                <h2 className="text-2xl font-bold mb-4">Edit Partner: <span className="text-accent">{partner.name}</span></h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Partner Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Contact Email</label>
                        <input name="contactEmail" type="email" value={formData.contactEmail} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Status</label>
                        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-primary-light mt-1">
                            <option value="Approved">Approved</option>
                            <option value="Pending KYB">Pending KYB</option>
                            <option value="Rejected">Rejected</option>
                        </select>
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

const PartnerDetailsModal: React.FC<{ partner: MockPartner; onClose: () => void; }> = ({ partner, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Partner Details</h2>
                        <p className="font-mono text-sm text-gray-400">ID: {partner.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div className="mt-6 bg-primary p-4 rounded-lg space-y-3 text-sm">
                    <div><p className="text-gray-400">Partner Name</p><p className="font-semibold text-white">{partner.name}</p></div>
                    <div><p className="text-gray-400">Contact Email</p><p className="font-semibold text-white">{partner.contactEmail}</p></div>
                    <div><p className="text-gray-400">Joined Date</p><p className="font-semibold text-white">{partner.joinedDate}</p></div>
                    <div><p className="text-gray-400">Total Volume</p><p className="font-semibold text-white font-mono">${partner.totalVolume.toLocaleString()}</p></div>
                    <div><p className="text-gray-400">Status</p><p><StatusBadge status={partner.status} /></p></div>
                </div>
                 <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Close</button>
                </div>
            </Card>
        </div>
    );
};


interface PartnersManagementProps {
    searchQuery: string;
}

const PartnersManagement: React.FC<PartnersManagementProps> = ({ searchQuery }) => {
    const [partners, setPartners] = useState(mockPartners);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<MockPartner | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingPartner, setViewingPartner] = useState<MockPartner | null>(null);

    const filteredPartners = useMemo(() => {
        if (!searchQuery) return partners;
        const lowercasedQuery = searchQuery.toLowerCase();
        return partners.filter(p => 
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.contactEmail.toLowerCase().includes(lowercasedQuery)
        );
    }, [partners, searchQuery]);
    
    const handleStatusChange = (partnerId: string, newStatus: 'Approved' | 'Rejected') => {
        setPartners(currentPartners =>
            currentPartners.map(p => p.id === partnerId ? { ...p, status: newStatus } : p)
        );
    };

    const handleEditClick = (partner: MockPartner) => {
        setEditingPartner(partner);
        setIsEditModalOpen(true);
    };

    const handleViewDetailsClick = (partner: MockPartner) => {
        setViewingPartner(partner);
        setIsDetailsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingPartner(null);
        setIsDetailsModalOpen(false);
        setViewingPartner(null);
    };

    const handleSavePartner = (updatedPartner: MockPartner) => {
        setPartners(currentPartners =>
            currentPartners.map(p => (p.id === updatedPartner.id ? updatedPartner : p))
        );
        handleCloseModal();
    };

    return (
        <>
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
                                <th className="px-6 py-3 text-center">Actions</th>
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
                                    <td className="px-6 py-4 space-x-2 whitespace-nowrap text-center">
                                        {partner.status === 'Pending KYB' ? (
                                            <>
                                                <button onClick={() => handleStatusChange(partner.id, 'Approved')} className="font-medium text-green-400 hover:underline text-xs">Approve</button>
                                                <button onClick={() => handleStatusChange(partner.id, 'Rejected')} className="font-medium text-red-400 hover:underline text-xs">Reject</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditClick(partner)} className="font-medium text-accent hover:underline text-xs">Edit</button>
                                                <button onClick={() => handleViewDetailsClick(partner)} className="font-medium text-accent hover:underline text-xs">View Details</button>
                                            </>
                                        )}
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

            {isEditModalOpen && editingPartner && (
                <EditPartnerModal
                    partner={editingPartner}
                    onClose={handleCloseModal}
                    onSave={handleSavePartner}
                />
            )}

            {isDetailsModalOpen && viewingPartner && (
                <PartnerDetailsModal
                    partner={viewingPartner}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default PartnersManagement;