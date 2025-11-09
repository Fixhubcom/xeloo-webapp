import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { RecurringPayment } from '../../types';

const mockRecurringPayments: RecurringPayment[] = [
    { id: 'rec-001', recipientName: 'Digital Exports', amount: 3500.00, currency: 'USD', frequency: 'Monthly', nextPaymentDate: '2024-08-15', status: 'Active' },
    { id: 'rec-002', recipientName: 'Innovate UK', amount: 250.00, currency: 'USD', frequency: 'Monthly', nextPaymentDate: '2024-08-20', status: 'Active' },
    { id: 'rec-003', recipientName: 'Ghana Goods', amount: 750.00, currency: 'USD', frequency: 'Weekly', nextPaymentDate: '2024-07-26', status: 'Paused' },
];

const StatusBadge: React.FC<{ status: RecurringPayment['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        Active: "bg-accent/20 text-accent",
        Paused: "bg-yellow-500/20 text-yellow-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


const RecurringPaymentForm: React.FC<{ onCancel: () => void; onSave: (payment: Omit<RecurringPayment, 'id'>) => void; }> = ({ onCancel, onSave }) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            const formData = new FormData(e.currentTarget);
            const newPayment = {
                recipientName: formData.get('recipientName') as string,
                amount: parseFloat(formData.get('amount') as string),
                currency: 'USD',
                frequency: formData.get('frequency') as 'Weekly' | 'Monthly' | 'Quarterly',
                nextPaymentDate: formData.get('startDate') as string,
                endDate: formData.get('endDate') as string || undefined,
                status: 'Active' as 'Active',
            };
            onSave(newPayment);
            setIsSaving(false);
        }, 1500);
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-white">Setup New Recurring Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="recipientName" placeholder="Recipient Name" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                <input name="amount" type="number" placeholder="Amount (USD)" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                <div>
                    <label className="text-sm font-medium text-gray-400">Frequency</label>
                    <select name="frequency" className="w-full mt-1 bg-primary p-2 rounded border border-primary-light" required>
                        <option>Weekly</option>
                        <option>Monthly</option>
                        <option>Quarterly</option>
                    </select>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-400">Start Date</label>
                        <input name="startDate" type="date" className="w-full mt-1 bg-primary p-2 rounded border border-primary-light" required min={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400">End Date (Optional)</label>
                        <input name="endDate" type="date" className="w-full mt-1 bg-primary p-2 rounded border border-primary-light" />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                    <button type="submit" disabled={isSaving} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center disabled:bg-gray-500">
                        {isSaving ? <Spinner /> : 'Save Schedule'}
                    </button>
                </div>
            </form>
        </Card>
    );
};

const RecurringPayments: React.FC = () => {
    const [payments, setPayments] = useState(mockRecurringPayments);
    const [showForm, setShowForm] = useState(false);

    const handleSave = (newPaymentData: Omit<RecurringPayment, 'id'>) => {
        const newPayment: RecurringPayment = {
            id: `rec-${String(payments.length + 1).padStart(3, '0')}`,
            ...newPaymentData,
        };
        setPayments(prev => [newPayment, ...prev]);
        setShowForm(false);
    };
    
    const toggleStatus = (id: string) => {
        setPayments(currentPayments =>
            currentPayments.map(p =>
                p.id === id ? { ...p, status: p.status === 'Active' ? 'Paused' : 'Active' } : p
            )
        );
    };

    if (showForm) {
        return <RecurringPaymentForm onCancel={() => setShowForm(false)} onSave={handleSave} />;
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-white">Manage Recurring Payments</h2>
                 <button onClick={() => setShowForm(true)} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">
                     Setup New
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-primary">
                        <tr>
                            <th scope="col" className="px-6 py-3">Recipient</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Frequency</th>
                            <th scope="col" className="px-6 py-3">Next Payment</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => (
                            <tr key={p.id} className="bg-primary-light border-b border-primary">
                                <td className="px-6 py-4 font-medium text-white">{p.recipientName}</td>
                                <td className="px-6 py-4 font-mono">{p.amount.toFixed(2)} {p.currency}</td>
                                <td className="px-6 py-4">{p.frequency}</td>
                                <td className="px-6 py-4">{p.nextPaymentDate}</td>
                                <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                                <td className="px-6 py-4">
                                     <button onClick={() => toggleStatus(p.id)} className={`text-xs font-bold py-1 px-3 rounded ${p.status === 'Active' ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40' : 'bg-accent/20 text-accent hover:bg-accent/40'}`}>
                                        {p.status === 'Active' ? 'Pause' : 'Resume'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default RecurringPayments;