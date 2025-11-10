
import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { Transaction } from '../../types';

type PlatformTransaction = Transaction & {
    userName: string;
    userCompany: string;
    type: 'User Transfer' | 'Merchant Payout' | 'Partner Settlement';
};

const mockPlatformTransactions: PlatformTransaction[] = [
    { id: '1', userName: 'John Doe', userCompany: 'Creative Solutions', type: 'User Transfer', date: '2024-07-22', recipient: 'Acme Inc.', recipientCountry: 'USA', recipientAccount: 'Chase Bank ****1234', amountSent: 500.00, currencySent: 'USD', amountReceived: 495.00, currencyReceived: 'USD', commission: 5.00, status: 'Completed', category: 'Supplies', amountSentUSD: 500.00, amountReceivedUSD: 495.00 },
    { id: '2', userName: 'John Doe', userCompany: 'Creative Solutions', type: 'User Transfer', date: '2024-07-21', recipient: 'Lagos Ventures', recipientCountry: 'Nigeria', recipientAccount: 'Access Bank ****5678', amountSent: 1000.00, currencySent: 'USD', amountReceived: 1450500.00, currencyReceived: 'NGN', commission: 15.00, status: 'Completed', amountSentUSD: 1000.00, amountReceivedUSD: 980.07 },
    { id: 'SET-001', userName: 'Super Admin', userCompany: 'Xeloo Corp', type: 'Partner Settlement', date: '2024-07-22', recipient: 'Global Bank', recipientCountry: 'USA', amountSent: 50000, currencySent: 'USD', amountReceived: 50000, currencyReceived: 'USD', commission: 0, status: 'Completed', amountSentUSD: 50000 },
    { id: 'PAY-001', userName: 'Crypto Merchant', userCompany: 'Digital Assets LLC', type: 'Merchant Payout', date: '2024-07-21', recipient: 'Crypto Merchant', recipientCountry: 'Nigeria', amountSent: 7252500, currencySent: 'NGN', amountReceived: 7252500, currencyReceived: 'NGN', commission: 0, status: 'Completed', amountSentUSD: 4900 },
    { id: '5', userName: 'NewBiz Co', userCompany: 'NewBiz Co', type: 'User Transfer', date: '2024-07-18', recipient: 'Nairobi Tech', recipientCountry: 'Kenya', recipientAccount: 'KCB ****7890', amountSent: 1200.00, currencySent: 'USD', amountReceived: 155400.00, currencyReceived: 'KES', commission: 18.00, status: 'Failed', category: 'Other', amountSentUSD: 1200.00, amountReceivedUSD: 1195.38 },
];

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        Completed: "bg-green-500/20 text-green-300",
        Pending: "bg-yellow-500/20 text-yellow-300",
        Failed: "bg-red-500/20 text-red-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const TransactionDetailsModal: React.FC<{ tx: PlatformTransaction; onClose: () => void; }> = ({ tx, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <Card className="w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Transaction Details</h2>
                        <p className="font-mono text-sm text-gray-400">ID: {tx.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-primary p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-400 mb-2">Initiator</h3>
                            <p className="font-bold text-white">{tx.userName}</p>
                            <p className="text-gray-300">{tx.userCompany}</p>
                        </div>
                         <div className="bg-primary p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-400 mb-2">Recipient</h3>
                            <p className="font-bold text-white">{tx.recipient}</p>
                            <p className="text-gray-300">{tx.recipientCountry}</p>
                            {tx.recipientAccount && <p className="font-mono text-xs text-gray-400 mt-1">{tx.recipientAccount}</p>}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-gray-400 mb-2">Financials</h3>
                        <div className="bg-primary p-4 rounded-lg space-y-2">
                             <div className="flex justify-between"><span>Amount Sent:</span> <span className="font-mono">{tx.amountSent.toLocaleString(undefined, {style:'currency', currency: tx.currencySent === 'USDT' ? 'USD' : tx.currencySent})}</span></div>
                            <div className="flex justify-between"><span>Amount Received:</span> <span className="font-mono">{tx.amountReceived.toLocaleString(undefined, {style:'currency', currency: tx.currencyReceived === 'USDT' ? 'USD' : tx.currencyReceived})}</span></div>
                            <div className="flex justify-between"><span>Xeloo Commission:</span> <span className="font-mono">{tx.commission.toLocaleString(undefined, {style:'currency', currency: tx.currencySent === 'USDT' ? 'USD' : tx.currencySent})}</span></div>
                             <hr className="border-primary-light" />
                             <div className="flex justify-between font-bold"><span>USD Equivalent:</span> <span className="font-mono text-accent">${(tx.amountSentUSD ?? tx.amountSent).toLocaleString()}</span></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-400 mb-2">Overview</h3>
                        <div className="bg-primary p-4 rounded-lg grid grid-cols-2 gap-x-4 gap-y-2">
                            <div className="flex justify-between"><span>Date:</span> <span className="font-semibold text-white">{tx.date}</span></div>
                            <div className="flex justify-between"><span>Status:</span> <span><StatusBadge status={tx.status} /></span></div>
                            <div className="flex justify-between"><span>Type:</span> <span className="font-semibold text-white">{tx.type}</span></div>
                            <div className="flex justify-between"><span>Category:</span> <span className="font-semibold text-white">{tx.category || 'N/A'}</span></div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

interface TransactionsManagementProps {
    searchQuery: string;
}

const TransactionsManagement: React.FC<TransactionsManagementProps> = ({ searchQuery }) => {
    const [transactions] = useState(mockPlatformTransactions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<PlatformTransaction | null>(null);

    const filteredTransactions = useMemo(() => {
        if (!searchQuery) return transactions;
        const lowercasedQuery = searchQuery.toLowerCase();
        return transactions.filter(tx => 
            tx.userName.toLowerCase().includes(lowercasedQuery) ||
            tx.userCompany.toLowerCase().includes(lowercasedQuery) ||
            tx.recipient.toLowerCase().includes(lowercasedQuery) ||
            tx.recipientCountry.toLowerCase().includes(lowercasedQuery) ||
            tx.type.toLowerCase().includes(lowercasedQuery) ||
            tx.id.toLowerCase().includes(lowercasedQuery)
        );
    }, [transactions, searchQuery]);

    const handleViewDetails = (tx: PlatformTransaction) => {
        setSelectedTx(tx);
        setIsModalOpen(true);
    };

    return (
        <>
            <Card>
                <h2 className="text-xl font-bold text-white mb-6">Platform Transactions</h2>
                {/* Add filtering controls here */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-primary">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Initiator</th>
                                <th className="px-6 py-3">Recipient</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3 text-right">Amount (USD Equiv.)</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(tx => (
                                <tr key={tx.id} className="bg-primary-light border-b border-primary">
                                    <td className="px-6 py-4">{tx.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{tx.userName}</div>
                                        <div className="text-xs">{tx.userCompany}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{tx.recipient}</div>
                                        <div className="text-xs">{tx.recipientCountry}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs">{tx.type}</td>
                                    <td className="px-6 py-4 font-mono text-right">${(tx.amountSentUSD ?? tx.amountSent).toLocaleString()}</td>
                                    <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleViewDetails(tx)} className="font-medium text-accent hover:underline text-xs">View Details</button>
                                    </td>
                                </tr>
                            ))}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-400">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            {isModalOpen && selectedTx && <TransactionDetailsModal tx={selectedTx} onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default TransactionsManagement;
