import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { Transaction } from '../../types';

type PartnerTransaction = Transaction & { originator: string };

const mockPartnerTransactions: PartnerTransaction[] = [
    { id: '1', date: '2024-07-22', originator: 'Creative Solutions', recipient: 'Acme Inc.', recipientCountry: 'USA', amountSent: 500.00, currencySent: 'USD', amountReceived: 495.00, currencyReceived: 'USD', commission: 5.00, status: 'Completed', amountSentUSD: 500.00, amountReceivedUSD: 495.00 },
    { id: '2', date: '2024-07-21', originator: 'Creative Solutions', recipient: 'Lagos Ventures', recipientCountry: 'Nigeria', amountSent: 1480000.00, currencySent: 'NGN', amountReceived: 985.00, currencyReceived: 'USD', commission: 15.00, status: 'Completed', amountSentUSD: 1000.00, amountReceivedUSD: 985.00 },
    { id: '4', date: '2024-07-19', originator: 'NewBiz Co', recipient: 'Ghana Goods', recipientCountry: 'Ghana', amountSent: 750.00, currencySent: 'USD', amountReceived: 9825.00, currencyReceived: 'GHS', commission: 11.25, status: 'Completed', amountSentUSD: 750.00, amountReceivedUSD: 677.59 },
    { id: '6', date: '2024-06-15', originator: 'Creative Solutions', recipient: 'Digital Exports', recipientCountry: 'USA', amountSent: 3500.00, currencySent: 'USD', amountReceived: 3482.50, currencyReceived: 'USD', commission: 52.50, status: 'Completed', amountSentUSD: 3500.00, amountReceivedUSD: 3482.50 },
    { id: '7', date: new Date().toISOString().split('T')[0], originator: 'John Doe', recipient: 'Recipient in China', recipientCountry: 'China', amountSent: 1000000, currencySent: 'NGN', amountReceived: 4826.55, currencyReceived: 'CNY', commission: 15000, status: 'Completed', amountSentUSD: 675.68, amountReceivedUSD: 665.54 },
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

interface PartnerTransactionsProps {
    searchQuery: string;
}

const PartnerTransactions: React.FC<PartnerTransactionsProps> = ({ searchQuery }) => {
    const [transactions] = useState(mockPartnerTransactions);

    const filteredTransactions = useMemo(() => {
        if (!searchQuery) return transactions;
        const lowercasedQuery = searchQuery.toLowerCase();
        return transactions.filter(tx => 
            tx.originator.toLowerCase().includes(lowercasedQuery) ||
            tx.recipient.toLowerCase().includes(lowercasedQuery) ||
            tx.recipientCountry.toLowerCase().includes(lowercasedQuery)
        );
    }, [transactions, searchQuery]);

    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-6">Transaction History</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-primary">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Originator</th>
                            <th className="px-6 py-3">Recipient</th>
                            <th className="px-6 py-3">Amount Sent</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="bg-primary-light border-b border-primary hover:bg-primary/80">
                                <td className="px-6 py-4">{tx.date}</td>
                                <td className="px-6 py-4 font-medium text-white">{tx.originator}</td>
                                <td className="px-6 py-4">{tx.recipient} ({tx.recipientCountry})</td>
                                <td className="px-6 py-4">
                                    <div className="font-mono text-white">{tx.amountSent.toLocaleString('en-US', { style: 'currency', currency: tx.currencySent })}</div>
                                    <div className="text-xs font-mono text-gray-500">~ {tx.amountSentUSD?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
                                </td>
                                <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                            </tr>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-400">No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default PartnerTransactions;
