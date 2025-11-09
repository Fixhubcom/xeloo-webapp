import React from 'react';
import Card from '../../components/common/Card';

const mockLedgerData = [
    { id: 1, date: '2024-07-22', description: 'Client Payment - Acme Inc.', debit: 0, credit: 495.00, balance: 100245.50 },
    { id: 2, date: '2024-07-21', description: 'Payout - Lagos Ventures', debit: 1015.00, credit: 0, balance: 99750.50 },
    { id: 3, date: '2024-07-15', description: 'Invoice INV-001 Paid', debit: 0, credit: 2500.00, balance: 100765.50 },
    { id: 4, date: '2024-07-12', description: 'Software Subscription', debit: 49.99, credit: 0, balance: 98265.50 },
    { id: 5, date: '2024-07-10', description: 'Payout - Ghana Goods', debit: 761.25, credit: 0, balance: 98315.49 },
];

const Accounting: React.FC = () => {
    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-6">General Ledger</h2>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-light">
                    <thead className="text-xs text-gray-400 uppercase bg-primary">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3 text-right">Debit</th>
                            <th scope="col" className="px-6 py-3 text-right">Credit</th>
                            <th scope="col" className="px-6 py-3 text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockLedgerData.map((entry) => (
                            <tr key={entry.id} className="bg-primary-light border-b border-gray-medium hover:bg-gray-dark">
                                <td className="px-6 py-4">{entry.date}</td>
                                <td className="px-6 py-4 font-medium text-white">{entry.description}</td>
                                <td className="px-6 py-4 font-mono text-red-400 text-right">{entry.debit > 0 ? entry.debit.toFixed(2) : '-'}</td>
                                <td className="px-6 py-4 font-mono text-green-400 text-right">{entry.credit > 0 ? entry.credit.toFixed(2) : '-'}</td>
                                <td className="px-6 py-4 font-mono text-white text-right">{entry.balance.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

export default Accounting;