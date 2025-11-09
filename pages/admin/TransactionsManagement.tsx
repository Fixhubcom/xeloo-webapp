import React from 'react';
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
    { id: 'SET-001', userName: 'Super Admin', userCompany: 'Xeloo Corp', type: 'Partner Settlement', date: '2024-07-22', recipient: 'Global Bank', recipientCountry: 'USA', amountSent: 50000, currencySent: 'USD', amountReceived: 50000, currencyReceived: 'USD', commission: 0, status: 'Completed' },
    { id: 'PAY-001', userName: 'Crypto Merchant', userCompany: 'Digital Assets LLC', type: 'Merchant Payout', date: '2024-07-21', recipient: 'Crypto Merchant', recipientCountry: 'Nigeria', amountSent: 7252500, currencySent: 'NGN', amountReceived: 7252500, currencyReceived: 'NGN', commission: 0, status: 'Completed' },
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

const TransactionsManagement: React.FC = () => {
    return (
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
                        {mockPlatformTransactions.map(tx => (
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
                                     <button className="font-medium text-accent hover:underline text-xs">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default TransactionsManagement;
