
import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';

interface Settlement {
    id: string;
    date: string;
    amount: number;
    currency: string;
    status: 'Completed' | 'In Transit';
    destination: string;
}

const mockSettlements: Settlement[] = [
    { id: 'PAY-001', date: '2024-07-21', amount: 5250.00, currency: 'USD', status: 'In Transit', destination: 'Bank of America ****2222' },
    { id: 'PAY-002', date: '2024-07-15', amount: 7252500.00, currency: 'NGN', status: 'Completed', destination: 'GTBank ****1111' },
    { id: 'PAY-003', date: '2024-07-10', amount: 10000.00, currency: 'USD', status: 'Completed', destination: 'Bank of America ****2222' },
];

const StatusBadge: React.FC<{ status: Settlement['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        'Completed': "bg-accent/20 text-accent",
        'In Transit': "bg-yellow-500/20 text-yellow-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

interface MerchantSettlementsProps {
    searchQuery: string;
}

const MerchantSettlements: React.FC<MerchantSettlementsProps> = ({ searchQuery }) => {
    const [settlements] = useState(mockSettlements);

    const filteredSettlements = useMemo(() => {
        if (!searchQuery) return settlements;
        const lowercasedQuery = searchQuery.toLowerCase();
        return settlements.filter(s => 
            s.id.toLowerCase().includes(lowercasedQuery) ||
            s.destination.toLowerCase().includes(lowercasedQuery)
        );
    }, [settlements, searchQuery]);


    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-6">Settlement History</h2>
            <p className="text-gray-400 mb-6">This is a record of all payouts from your Xeloo sales to your bank account.</p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-primary">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Settlement ID</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Destination</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSettlements.map((settlement) => (
                            <tr key={settlement.id} className="bg-primary-light border-b border-primary hover:bg-primary/80">
                                <td className="px-6 py-4">{settlement.date}</td>
                                <td className="px-6 py-4 font-mono text-white">{settlement.id}</td>
                                <td className="px-6 py-4 font-mono text-white">{settlement.amount.toLocaleString('en-US', { style: 'currency', currency: settlement.currency })}</td>
                                <td className="px-6 py-4 text-xs">{settlement.destination}</td>
                                <td className="px-6 py-4"><StatusBadge status={settlement.status} /></td>
                            </tr>
                        ))}
                        {filteredSettlements.length === 0 && (
                             <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-400">No settlements found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default MerchantSettlements;
