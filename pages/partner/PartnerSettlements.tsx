import React from 'react';
import Card from '../../components/common/Card';
import { PartnerSettlement } from '../../types';

const mockSettlements: PartnerSettlement[] = [
    { id: 'SET-001', date: '2024-07-22', partnerName: 'Global Bank', amount: 50000, currency: 'USD', status: 'Settled' },
    { id: 'SET-002', date: '2024-07-22', partnerName: 'Global Bank', amount: 75000, currency: 'USD', status: 'Pending' },
    { id: 'SET-003', date: '2024-07-21', partnerName: 'Global Bank', amount: 120000, currency: 'USD', status: 'Settled' },
    { id: 'SET-004', date: '2024-07-20', partnerName: 'Global Bank', amount: 25000, currency: 'USD', status: 'Settled' },
    { id: 'SET-005', date: '2024-07-20', partnerName: 'Global Bank', amount: 75000, currency: 'USD', status: 'Pending' },
];

const StatusBadge: React.FC<{ status: PartnerSettlement['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        Settled: "bg-accent/20 text-accent",
        Pending: "bg-yellow-500/20 text-yellow-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


const PartnerSettlements: React.FC = () => {
    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-6">Settlement History</h2>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-primary">
                        <tr>
                            <th scope="col" className="px-6 py-3">Settlement ID</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockSettlements.map((settlement) => (
                            <tr key={settlement.id} className="bg-primary-light border-b border-primary hover:bg-primary/80">
                                <td className="px-6 py-4 font-mono text-white">{settlement.id}</td>
                                <td className="px-6 py-4">{settlement.date}</td>
                                <td className="px-6 py-4 font-mono text-white text-right">{settlement.amount.toLocaleString('en-US', { style: 'currency', currency: settlement.currency })}</td>
                                <td className="px-6 py-4"><StatusBadge status={settlement.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default PartnerSettlements;