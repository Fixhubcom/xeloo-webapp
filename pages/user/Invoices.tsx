import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { Invoice } from '../../types';
import Spinner from '../../components/common/Spinner';

const mockInvoices: Invoice[] = [
    { id: 'inv-001', clientName: 'Creative Solutions', issueDate: '2024-07-15', dueDate: '2024-08-14', amount: 2500, currency: 'USD', status: 'Paid' },
    { id: 'inv-002', clientName: 'Web Wizards', issueDate: '2024-07-10', dueDate: '2024-08-09', amount: 5000, currency: 'USD', status: 'Unpaid' },
    { id: 'inv-003', clientName: 'Marketing Pro', issueDate: '2024-06-01', dueDate: '2024-07-01', amount: 1200, currency: 'USD', status: 'Overdue' },
];

const StatusBadge: React.FC<{ status: Invoice['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        Paid: "bg-accent/20 text-accent",
        Unpaid: "bg-blue-500/20 text-blue-300",
        Overdue: "bg-red-500/20 text-red-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


const InvoiceForm: React.FC<{ onCancel: () => void, onSave: (invoice: Omit<Invoice, 'id'>) => void }> = ({ onCancel, onSave }) => {
    const [isSaving, setIsSaving] = useState(false);
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate save
        setTimeout(() => {
            const formData = new FormData(e.currentTarget);
            const newInvoice = {
                clientName: formData.get('clientName') as string,
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: formData.get('dueDate') as string,
                amount: parseFloat(formData.get('amount') as string),
                currency: 'USD',
                status: 'Unpaid' as 'Unpaid'
            };
            onSave(newInvoice);
            setIsSaving(false);
        }, 1500);
    };

    return (
        <Card className="max-w-2xl mx-auto">
             <h2 className="text-xl font-bold mb-4">Create New Invoice</h2>
             <form onSubmit={handleSubmit} className="space-y-4">
                 <input name="clientName" placeholder="Client Name" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                 <input name="amount" type="number" placeholder="Amount (USD)" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                 <div>
                     <label className="text-sm text-gray-400">Due Date</label>
                     <input name="dueDate" type="date" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                 </div>
                 <div className="flex justify-end space-x-3 mt-4">
                     <button type="button" onClick={onCancel} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                     <button type="submit" disabled={isSaving} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center disabled:bg-gray-500">
                         {isSaving ? <Spinner /> : 'Save Invoice'}
                     </button>
                 </div>
             </form>
        </Card>
    );
};

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState(mockInvoices);
    const [showForm, setShowForm] = useState(false);

    const handleSave = (newInvoiceData: Omit<Invoice, 'id'>) => {
        const newInvoice: Invoice = {
            id: `inv-${String(invoices.length + 1).padStart(3, '0')}`,
            ...newInvoiceData,
        };
        setInvoices(prev => [newInvoice, ...prev]);
        setShowForm(false);
    };

    if (showForm) {
        return <InvoiceForm onCancel={() => setShowForm(false)} onSave={handleSave} />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-white">Invoice Management</h2>
                 <button onClick={() => setShowForm(true)} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Create New Invoice</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {invoices.map(invoice => (
                    <Card key={invoice.id} className="flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white">{invoice.clientName}</h3>
                                <StatusBadge status={invoice.status} />
                            </div>
                            <p className="text-2xl font-mono text-accent mb-4">{invoice.amount.toLocaleString('en-US', { style: 'currency', currency: invoice.currency })}</p>
                            <p className="text-sm text-gray-400">Invoice ID: {invoice.id}</p>
                        </div>
                        <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-primary">
                            <span>Issued: {invoice.issueDate}</span>
                            <span className="float-right">Due: {invoice.dueDate}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Invoices;