import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';

interface MockMerchant {
    id: string;
    name: string;
    email: string;
    companyName: string;
    status: 'Approved' | 'Pending Review' | 'Suspended' | 'Rejected';
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
        'Rejected': "bg-red-500/20 text-red-300",
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusClasses[status]}`}>{status}</span>;
};

const EditMerchantModal: React.FC<{
    merchant: MockMerchant;
    onClose: () => void;
    onSave: (updatedMerchant: MockMerchant) => void;
}> = ({ merchant, onClose, onSave }) => {
    const [formData, setFormData] = useState<MockMerchant>(merchant);

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
                <h2 className="text-2xl font-bold mb-4">Edit Merchant: <span className="text-accent">{merchant.name}</span></h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Company Name</label>
                        <input name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Contact Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-primary-light mt-1" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Status</label>
                        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-primary p-2 rounded border border-primary-light mt-1">
                            <option value="Approved">Approved</option>
                            <option value="Pending Review">Pending Review</option>
                            <option value="Suspended">Suspended</option>
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

const MerchantDetailsModal: React.FC<{ merchant: MockMerchant; onClose: () => void; }> = ({ merchant, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Merchant Details</h2>
                        <p className="font-mono text-sm text-gray-400">ID: {merchant.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div className="mt-6 bg-primary p-4 rounded-lg space-y-3 text-sm">
                    <div><p className="text-gray-400">Name</p><p className="font-semibold text-white">{merchant.name}</p></div>
                    <div><p className="text-gray-400">Company Name</p><p className="font-semibold text-white">{merchant.companyName}</p></div>
                    <div><p className="text-gray-400">Contact Email</p><p className="font-semibold text-white">{merchant.email}</p></div>
                    <div><p className="text-gray-400">Joined Date</p><p className="font-semibold text-white">{merchant.joinedDate}</p></div>
                    <div><p className="text-gray-400">Total Sales</p><p className="font-semibold text-white font-mono">${merchant.totalSales.toLocaleString()}</p></div>
                    <div><p className="text-gray-400">Status</p><p><StatusBadge status={merchant.status} /></p></div>
                </div>
                 <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Close</button>
                </div>
            </Card>
        </div>
    );
};

interface MerchantsManagementProps {
    searchQuery: string;
}

const MerchantsManagement: React.FC<MerchantsManagementProps> = ({ searchQuery }) => {
    const [merchants, setMerchants] = useState(mockMerchants);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMerchant, setEditingMerchant] = useState<MockMerchant | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingMerchant, setViewingMerchant] = useState<MockMerchant | null>(null);

    const filteredMerchants = useMemo(() => {
        if (!searchQuery) return merchants;
        const lowercasedQuery = searchQuery.toLowerCase();
        return merchants.filter(m => 
            m.name.toLowerCase().includes(lowercasedQuery) ||
            m.email.toLowerCase().includes(lowercasedQuery) ||
            m.companyName.toLowerCase().includes(lowercasedQuery)
        );
    }, [merchants, searchQuery]);

    const handleStatusChange = (merchantId: string, newStatus: MockMerchant['status']) => {
        setMerchants(currentMerchants =>
            currentMerchants.map(m =>
                m.id === merchantId ? { ...m, status: newStatus } : m
            )
        );
    };

    const handleEditClick = (merchant: MockMerchant) => {
        setEditingMerchant(merchant);
        setIsEditModalOpen(true);
    };

    const handleViewDetailsClick = (merchant: MockMerchant) => {
        setViewingMerchant(merchant);
        setIsDetailsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEditingMerchant(null);
        setIsDetailsModalOpen(false);
        setViewingMerchant(null);
    };

    const handleSaveMerchant = (updatedMerchant: MockMerchant) => {
        setMerchants(currentMerchants =>
            currentMerchants.map(m => (m.id === updatedMerchant.id ? updatedMerchant : m))
        );
        handleCloseModal();
    };

    return (
        <>
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
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMerchants.map(merchant => (
                                <tr key={merchant.id} className="bg-primary-light border-b border-primary">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{merchant.name}</div>
                                        <div className="text-xs">{merchant.email}</div>
                                    </td>
                                    <td className="px-6 py-4">{merchant.companyName}</td>
                                    <td className="px-6 py-4">{merchant.joinedDate}</td>
                                    <td className="px-6 py-4 font-mono text-right">${merchant.totalSales.toLocaleString()}</td>
                                    <td className="px-6 py-4"><StatusBadge status={merchant.status} /></td>
                                    <td className="px-6 py-4 space-x-2 text-center whitespace-nowrap">
                                        {merchant.status === 'Pending Review' ? (
                                            <>
                                                <button onClick={() => handleStatusChange(merchant.id, 'Approved')} className="font-medium text-green-400 hover:underline text-xs">Approve</button>
                                                <button onClick={() => handleStatusChange(merchant.id, 'Rejected')} className="font-medium text-red-400 hover:underline text-xs">Reject</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditClick(merchant)} className="font-medium text-accent hover:underline text-xs">Edit</button>
                                                <button onClick={() => handleViewDetailsClick(merchant)} className="font-medium text-accent hover:underline text-xs">View Details</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredMerchants.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-400">No merchants found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isEditModalOpen && editingMerchant && (
                <EditMerchantModal
                    merchant={editingMerchant}
                    onClose={handleCloseModal}
                    onSave={handleSaveMerchant}
                />
            )}

            {isDetailsModalOpen && viewingMerchant && (
                <MerchantDetailsModal
                    merchant={viewingMerchant}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default MerchantsManagement;