import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';

interface SaleTransaction {
    id: string;
    listingId: string;
    date: string;
    saleAmount: number;
    currency: string;
    fee: number;
    netAmount: number;
    status: 'Paid Out' | 'Processing';
}

const mockSales: SaleTransaction[] = [
    { id: 'SALE-001', listingId: 'LST-002', date: '2024-07-10', saleAmount: 10000, currency: 'USD', fee: 300, netAmount: 9700, status: 'Paid Out' },
    { id: 'SALE-002', listingId: 'LST-001', date: '2024-07-20', saleAmount: 725250, currency: 'NGN', fee: 21757.5, netAmount: 703492.5, status: 'Paid Out' },
    { id: 'SALE-003', listingId: 'LST-003', date: '2024-07-22', saleAmount: 32750, currency: 'GHS', fee: 982.5, netAmount: 31767.5, status: 'Processing' },
];

const StatusBadge: React.FC<{ status: SaleTransaction['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        'Paid Out': "bg-accent/20 text-accent",
        'Processing': "bg-yellow-500/20 text-yellow-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

interface MerchantTransactionsProps {
    searchQuery: string;
}

const MerchantTransactions: React.FC<MerchantTransactionsProps> = ({ searchQuery }) => {
    const [transactions] = useState(mockSales);

    const filteredTransactions = useMemo(() => {
        if (!searchQuery) return transactions;
        const lowercasedQuery = searchQuery.toLowerCase();
        return transactions.filter(tx => 
            tx.id.toLowerCase().includes(lowercasedQuery) ||
            tx.listingId.toLowerCase().includes(lowercasedQuery)
        );
    }, [transactions, searchQuery]);

    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-6">Sales Transactions</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-primary">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Transaction ID</th>
                            <th scope="col" className="px-6 py-3">Listing ID</th>
                            <th scope="col" className="px-6 py-3 text-right">Sale Amount</th>
                            <th scope="col" className="px-6 py-3 text-right">Fee</th>
                            <th scope="col" className="px-6 py-3 text-right">Net Payout</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((tx) => (
                            <tr key={tx.id} className="bg-primary-light border-b border-primary hover:bg-primary/80">
                                <td className="px-6 py-4">{tx.date}</td>
                                <td className="px-6 py-4 font-mono text-white">{tx.id}</td>
                                <td className="px-6 py-4 font-mono">{tx.listingId}</td>
                                <td className="px-6 py-4 font-mono text-right">{tx.saleAmount.toLocaleString('en-US', { style: 'currency', currency: tx.currency })}</td>
                                <td className="px-6 py-4 font-mono text-right text-yellow-400">{tx.fee.toLocaleString('en-US', { style: 'currency', currency: tx.currency })}</td>
                                <td className="px-6 py-4 font-mono text-right text-accent">{tx.netAmount.toLocaleString('en-US', { style: 'currency', currency: tx.currency })}</td>
                                <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
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
    );
};

export default MerchantTransactions;
