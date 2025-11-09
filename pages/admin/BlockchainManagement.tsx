
import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { MultiSigTransaction } from '../../types';

const mockPartnerWallets = [
    { partnerId: '1', partnerName: 'Global Bank', hederaWalletAddress: '0.0.123456', balance: 500000.00 },
    { partnerId: '2', partnerName: 'Africa Payouts Ltd', hederaWalletAddress: '0.0.654321', balance: 750000.00 },
    { partnerId: '3', partnerName: 'Prime Exchange', hederaWalletAddress: '0.0.112233', balance: 250000.00 },
];

const mockPendingAdminTransactions: MultiSigTransaction[] = [
    { id: 'TXN-HEDERA-003', partnerId: '2', partnerName: 'Africa Payouts Ltd', amount: 100000, currency: 'USDT', destinationAddress: '0.0.445566', status: 'Pending Admin' },
];

const StatusBadge: React.FC<{ status: MultiSigTransaction['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        'Pending Partner': "bg-yellow-500/20 text-yellow-300",
        'Pending Admin': "bg-blue-500/20 text-blue-300",
        Completed: "bg-green-500/20 text-green-300",
        Rejected: "bg-red-500/20 text-red-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const BlockchainManagement: React.FC = () => {

    return (
        <div className="space-y-8">
            <Card>
                <h2 className="text-xl font-bold mb-4">Partner Wallet Overview</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-light">
                        <thead className="text-xs text-gray-400 uppercase bg-primary">
                            <tr>
                                <th className="px-6 py-3">Partner</th>
                                <th className="px-6 py-3">Wallet Address</th>
                                <th className="px-6 py-3 text-right">Balance (USD Equiv.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPartnerWallets.map(wallet => (
                                <tr key={wallet.partnerId} className="bg-primary-light border-b border-gray-medium">
                                    <td className="px-6 py-4 font-medium text-white">{wallet.partnerName}</td>
                                    <td className="px-6 py-4 font-mono">{wallet.hederaWalletAddress}</td>
                                    <td className="px-6 py-4 font-mono text-right">${wallet.balance.toLocaleString('en-US')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4 text-yellow-400">Action Required: Pending Co-Signatures</h2>
                <p className="text-gray-light mb-6">The following transactions have been signed by the partner and require a co-signature from Xeloo admin to be executed on the Hedera network.</p>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-light">
                        <thead className="text-xs text-gray-400 uppercase bg-primary">
                            <tr>
                                <th className="px-6 py-3">Transaction ID</th>
                                <th className="px-6 py-3">Partner</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Destination</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockPendingAdminTransactions.map(tx => (
                                <tr key={tx.id} className="bg-primary-light border-b border-gray-medium">
                                    <td className="px-6 py-4 font-mono text-white">{tx.id}</td>
                                    <td className="px-6 py-4">{tx.partnerName}</td>
                                    <td className="px-6 py-4 font-mono">{tx.amount.toLocaleString()} {tx.currency}</td>
                                    <td className="px-6 py-4 font-mono">{tx.destinationAddress}</td>
                                    <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                                    <td className="px-6 py-4 space-x-2 text-center">
                                        <button className="text-xs font-bold py-1 px-3 rounded bg-green-500/20 text-green-300 hover:bg-green-500/40">Co-Sign & Approve</button>
                                        <button className="text-xs font-bold py-1 px-3 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40">Reject</button>
                                    </td>
                                </tr>
                            ))}
                             {mockPendingAdminTransactions.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-4 text-gray-400">No transactions require your signature.</td></tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </Card>
        </div>
    );
};

export default BlockchainManagement;
