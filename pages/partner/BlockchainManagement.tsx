import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { MultiSigTransaction } from '../../types';

const mockPendingTransactions: MultiSigTransaction[] = [
    { id: 'TXN-HEDERA-001', partnerId: '1', partnerName: 'Global Bank', amount: 50000, currency: 'USDT', destinationAddress: '0.0.987654', status: 'Pending Partner' },
    { id: 'TXN-HEDERA-002', partnerId: '1', partnerName: 'Global Bank', amount: 25000, currency: 'USDT', destinationAddress: '0.0.112233', status: 'Pending Partner' },
];

const StatusBadge: React.FC<{ status: MultiSigTransaction['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        'Pending Partner': "bg-yellow-500/20 text-yellow-300",
        'Pending Admin': "bg-blue-500/20 text-blue-300",
        Completed: "bg-accent/20 text-accent",
        Rejected: "bg-red-500/20 text-red-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const BlockchainManagement: React.FC = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState(mockPendingTransactions);

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-xl font-bold mb-2">Hedera Multi-Sig Wallet</h2>
                <p className="text-gray-400 mb-6">This is your organization's multi-signature wallet used for holding and signing for settlement funds.</p>
                <div className="bg-primary p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Wallet Address:</span>
                        <span className="font-mono text-accent">{user?.hederaWalletAddress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Current Balance (USD Equivalent):</span>
                        <span className="font-mono text-2xl font-bold text-white">$500,000.00</span>
                    </div>
                </div>
            </Card>
            <Card>
                <h2 className="text-xl font-bold mb-4">Pending Transactions (Awaiting Your Signature)</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-primary">
                            <tr>
                                <th className="px-6 py-3">Transaction ID</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Destination</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} className="bg-primary-light border-b border-primary">
                                    <td className="px-6 py-4 font-mono text-white">{tx.id}</td>
                                    <td className="px-6 py-4 font-mono">{tx.amount.toLocaleString()} {tx.currency}</td>
                                    <td className="px-6 py-4 font-mono">{tx.destinationAddress}</td>
                                    <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                                    <td className="px-6 py-4 space-x-2 text-center">
                                        <button className="text-xs font-bold py-1 px-3 rounded bg-accent/20 text-accent hover:bg-accent/40">Approve</button>
                                        <button className="text-xs font-bold py-1 px-3 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40">Reject</button>
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

export default BlockchainManagement;