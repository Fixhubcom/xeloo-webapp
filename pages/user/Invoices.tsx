
import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';

// --- MOCK DATA & TYPES ---
interface Client { id: string; name: string; email: string; address: string; }
interface InvoiceItem { id: string; description: string; quantity: number; price: number; }
interface Invoice {
    id: string;
    client: Client;
    issueDate: string;
    dueDate: string;
    items: InvoiceItem[];
    status: 'Paid' | 'Unpaid' | 'Overdue';
    total: number;
}

const mockClients: Client[] = [
    { id: 'cli_1', name: 'Creative Solutions', email: 'contact@creative.com', address: '123 Design Lane, San Francisco, CA 94102' },
    { id: 'cli_2', name: 'Web Wizards', email: 'billing@webwizards.dev', address: '456 Code Street, Austin, TX 78701' },
];

const mockInvoices: Invoice[] = [
    { 
        id: 'inv-001', 
        client: mockClients[0], 
        issueDate: '2024-07-15', 
        dueDate: '2024-08-14', 
        items: [
            { id: 'item_1', description: 'Website Redesign', quantity: 1, price: 2000 },
            { id: 'item_2', description: 'Monthly Hosting', quantity: 1, price: 500 }
        ],
        status: 'Paid',
        total: 2500,
    },
    { 
        id: 'inv-002', 
        client: mockClients[1], 
        issueDate: '2024-07-10', 
        dueDate: '2024-08-09', 
        items: [
            { id: 'item_3', description: 'API Integration Development', quantity: 50, price: 100 }
        ],
        status: 'Unpaid',
        total: 5000,
    },
];
// --- END MOCK DATA ---

const StatusBadge: React.FC<{ status: Invoice['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    const statusClasses = {
        Paid: "bg-accent/20 text-accent",
        Unpaid: "bg-blue-500/20 text-blue-300",
        Overdue: "bg-red-500/20 text-red-300",
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

interface InvoicesProps {
  searchQuery: string;
}

const Invoices: React.FC<InvoicesProps> = ({ searchQuery }) => {
    const { user } = useAuth();
    const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    const [clients, setClients] = useState<Client[]>(mockClients);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [newClientName, setNewClientName] = useState('');
    const [newClientEmail, setNewClientEmail] = useState('');
    const [newClientAddress, setNewClientAddress] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState<Omit<InvoiceItem, 'id'>[]>([{ description: '', quantity: 1, price: 0 }]);

    const totalAmount = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.price, 0), [items]);

    const filteredInvoices = useMemo(() => {
        if (!searchQuery) return invoices;
        const lowercasedQuery = searchQuery.toLowerCase();
        return invoices.filter(invoice => 
            invoice.client.name.toLowerCase().includes(lowercasedQuery) ||
            invoice.id.toLowerCase().includes(lowercasedQuery)
        );
    }, [invoices, searchQuery]);

    const handleItemChange = (index: number, field: keyof Omit<InvoiceItem, 'id'>, value: string | number) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

    const resetForm = () => {
        setSelectedClientId('');
        setNewClientName('');
        setNewClientEmail('');
        setNewClientAddress('');
        setDueDate('');
        setItems([{ description: '', quantity: 1, price: 0 }]);
    };
    
    const handleSave = () => {
        setIsSaving(true);
        let client: Client;
        if (selectedClientId === 'new') {
            client = { id: `cli_${Date.now()}`, name: newClientName, email: newClientEmail, address: newClientAddress };
            setClients(prev => [...prev, client]);
        } else {
            client = clients.find(c => c.id === selectedClientId)!;
        }

        const newInvoice: Invoice = {
            id: `inv-${String(invoices.length + 1).padStart(3, '0')}`,
            client,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate,
            items: items.map((item, i) => ({ ...item, id: `item_${Date.now()}_${i}` })),
            status: 'Unpaid',
            total: totalAmount,
        };
        
        setTimeout(() => {
            setInvoices(prev => [newInvoice, ...prev]);
            setIsSaving(false);
            resetForm();
            setView('list');
        }, 1500);
    };

    const handlePrint = () => {
        window.print();
    };

    // --- RENDER FUNCTIONS ---

    const renderListView = () => (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-white">Invoice Management</h2>
                 <button onClick={() => setView('form')} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Create New Invoice</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInvoices.map(invoice => (
                    <Card key={invoice.id} className="flex flex-col justify-between cursor-pointer hover:border-accent" onClick={() => { setSelectedInvoice(invoice); setView('detail'); }}>
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white">{invoice.client.name}</h3>
                                <StatusBadge status={invoice.status} />
                            </div>
                            <p className="text-2xl font-mono text-accent mb-4">{invoice.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                            <p className="text-sm text-gray-400">Invoice ID: {invoice.id}</p>
                        </div>
                        <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-primary">
                            <span>Issued: {invoice.issueDate}</span>
                            <span className="float-right">Due: {invoice.dueDate}</span>
                        </div>
                    </Card>
                ))}
            </div>
            {filteredInvoices.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p>No invoices found matching your search.</p>
                </div>
            )}
        </div>
    );
    
    const renderFormView = () => (
        <Card className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Invoice</h2>
            <div className="space-y-6">
                {/* Client Section */}
                <fieldset className="border border-primary-light p-4 rounded-lg">
                    <legend className="px-2 font-semibold">Client Information</legend>
                    <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light">
                        <option value="">-- Select an existing client --</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        <option value="new">-- Add a new client --</option>
                    </select>
                    {selectedClientId === 'new' && (
                        <div className="mt-4 space-y-3">
                            <input value={newClientName} onChange={e => setNewClientName(e.target.value)} placeholder="New Client Name" className="w-full bg-primary p-2 rounded border border-primary-light" />
                            <input value={newClientEmail} onChange={e => setNewClientEmail(e.target.value)} type="email" placeholder="Client Email" className="w-full bg-primary p-2 rounded border border-primary-light" />
                            <input value={newClientAddress} onChange={e => setNewClientAddress(e.target.value)} placeholder="Client Address" className="w-full bg-primary p-2 rounded border border-primary-light" />
                        </div>
                    )}
                </fieldset>

                {/* Items Section */}
                <fieldset className="border border-primary-light p-4 rounded-lg">
                    <legend className="px-2 font-semibold">Invoice Items</legend>
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 mb-3">
                            <input value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} placeholder="Item Description" className="flex-grow bg-primary p-2 rounded border border-primary-light" />
                            <input value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)} type="number" placeholder="Qty" className="w-20 bg-primary p-2 rounded border border-primary-light" />
                            <input value={item.price} onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} type="number" step="0.01" placeholder="Price" className="w-24 bg-primary p-2 rounded border border-primary-light" />
                            <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 font-bold text-xl">&times;</button>
                        </div>
                    ))}
                    <button onClick={addItem} className="text-sm text-accent font-semibold hover:underline">+ Add Item</button>
                </fieldset>

                {/* Details & Total */}
                <div className="flex justify-between items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Due Date</label>
                        <input value={dueDate} onChange={e => setDueDate(e.target.value)} type="date" className="mt-1 bg-primary p-2 rounded border border-primary-light" />
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400">Total Amount</p>
                        <p className="text-3xl font-bold text-accent">{totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-primary-light">
                    <button onClick={() => setView('list')} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 flex items-center justify-center w-36">
                        {isSaving ? <Spinner /> : 'Save Invoice'}
                    </button>
                </div>
            </div>
        </Card>
    );

    const renderDetailView = () => (
        <div>
            <div className="flex justify-between items-center mb-6 no-print">
                <button onClick={() => setView('list')} className="bg-primary-light text-white font-bold py-2 px-4 rounded hover:opacity-90">&larr; Back to Invoices</button>
                <button onClick={handlePrint} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Print / Download PDF</button>
            </div>
            
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #invoice-printable, #invoice-printable * { visibility: visible; }
                    #invoice-printable { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none; }
                }
            `}</style>
            
            <Card id="invoice-printable" className="max-w-4xl mx-auto p-12 printable-area">
                <header className="flex justify-between items-start pb-8 border-b border-primary">
                    <div>
                        <h1 className="text-4xl font-bold text-white">INVOICE</h1>
                        <p className="text-gray-400 mt-2">Invoice #: {selectedInvoice?.id}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-semibold">{user?.companyName}</h2>
                        <p className="text-gray-400">{user?.email}</p>
                    </div>
                </header>
                <section className="flex justify-between my-8">
                    <div>
                        <p className="font-semibold text-gray-400 mb-1">BILLED TO</p>
                        <h3 className="text-xl font-bold text-white">{selectedInvoice?.client.name}</h3>
                        <p className="text-gray-300">{selectedInvoice?.client.address}</p>
                        <p className="text-gray-300">{selectedInvoice?.client.email}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-gray-400">Issue Date: <span className="text-white font-normal">{selectedInvoice?.issueDate}</span></p>
                        <p className="font-semibold text-gray-400">Due Date: <span className="text-white font-normal">{selectedInvoice?.dueDate}</span></p>
                    </div>
                </section>
                <section>
                    <table className="w-full text-left">
                        <thead className="bg-primary">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide">Description</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-center">Qty</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-right">Unit Price</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary">
                            {selectedInvoice?.items.map(item => (
                                <tr key={item.id}>
                                    <td className="p-3 text-white">{item.description}</td>
                                    <td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-right font-mono">${item.price.toFixed(2)}</td>
                                    <td className="p-3 text-right font-mono">${(item.quantity * item.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <section className="flex justify-end mt-8">
                    <div className="w-full max-w-xs space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Subtotal:</span>
                            <span className="font-mono">${selectedInvoice?.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-2xl text-accent border-t-2 border-accent pt-3">
                            <span>Total:</span>
                            <span className="font-mono">${selectedInvoice?.total.toFixed(2)}</span>
                        </div>
                    </div>
                </section>
            </Card>
        </div>
    );


    switch (view) {
        case 'form': return renderFormView();
        case 'detail': return renderDetailView();
        default: return renderListView();
    }
};

export default Invoices;
