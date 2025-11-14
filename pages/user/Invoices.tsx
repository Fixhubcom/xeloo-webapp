
import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';

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
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    notes?: string;
    // FIX: Add currency property to the Invoice interface to resolve type error.
    currency: string;
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
        subtotal: 2500,
        tax: 200,
        discount: 0,
        total: 2700,
        notes: 'Thank you for your business!',
        currency: 'USD',
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
        subtotal: 5000,
        tax: 0,
        discount: 500,
        total: 4500,
        notes: '10% early payment discount applied.',
        currency: 'USD',
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
    const [tax, setTax] = useState('');
    const [discount, setDiscount] = useState('');
    const [notes, setNotes] = useState('');


    const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.price, 0), [items]);
    const taxAmount = parseFloat(tax) || 0;
    const discountAmount = parseFloat(discount) || 0;
    const grandTotal = subtotal + taxAmount - discountAmount;

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
        setTax('');
        setDiscount('');
        setNotes('');
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
            subtotal,
            tax: taxAmount,
            discount: discountAmount,
            total: grandTotal,
            notes,
            currency: 'USD',
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

    const handleMarkAsPaid = (invoiceId: string) => {
        setInvoices(currentInvoices =>
            currentInvoices.map(inv =>
                inv.id === invoiceId ? { ...inv, status: 'Paid' } : inv
            )
        );
        if (selectedInvoice && selectedInvoice.id === invoiceId) {
            setSelectedInvoice(prev => prev ? { ...prev, status: 'Paid' } : null);
        }
    };

    // --- RENDER FUNCTIONS ---

    const renderListView = () => (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                 <h2 className="text-xl font-bold text-white">Invoice Management</h2>
                 <button onClick={() => setView('form')} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 w-full sm:w-auto">Create New Invoice</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInvoices.map(invoice => (
                    <Card key={invoice.id} className="flex flex-col justify-between cursor-pointer hover:border-accent" onClick={() => { setSelectedInvoice(invoice); setView('detail'); }}>
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white">{invoice.client.name}</h3>
                                <StatusBadge status={invoice.status} />
                            </div>
                            <p className="text-2xl font-mono text-accent mb-4">{invoice.total.toLocaleString('en-US', { style: 'currency', currency: invoice.currency })}</p>
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
                        <div key={index} className="flex flex-col sm:flex-row items-center gap-3 mb-3">
                            <input value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} placeholder="Item Description" className="w-full sm:flex-grow bg-primary p-2 rounded border border-primary-light" />
                            <div className="flex w-full sm:w-auto gap-3">
                                <input value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)} type="number" placeholder="Qty" className="w-1/2 sm:w-20 bg-primary p-2 rounded border border-primary-light" />
                                <input value={item.price} onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)} type="number" step="0.01" placeholder="Price" className="w-1/2 sm:w-24 bg-primary p-2 rounded border border-primary-light" />
                            </div>
                            <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 font-bold text-xl">&times;</button>
                        </div>
                    ))}
                    <button onClick={addItem} className="text-sm text-accent font-semibold hover:underline">+ Add Item</button>
                </fieldset>

                <fieldset className="border border-primary-light p-4 rounded-lg">
                    <legend className="px-2 font-semibold">Notes & Terms</legend>
                     <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="e.g., Thank you for your business. Payment is due within 30 days." className="w-full bg-primary p-2 rounded border border-primary-light" />
                </fieldset>

                {/* Details & Total */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
                     <div>
                        <label className="block text-sm font-medium text-gray-400">Due Date</label>
                        <input value={dueDate} onChange={e => setDueDate(e.target.value)} type="date" className="mt-1 bg-primary p-2 rounded border border-primary-light" />
                    </div>
                    <div className="space-y-2">
                         <div className="flex justify-between items-center">
                            <span className="text-gray-400">Subtotal</span>
                            <span className="font-mono">{subtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <label htmlFor="tax" className="text-gray-400">Tax</label>
                            <input id="tax" value={tax} onChange={e => setTax(e.target.value)} type="number" placeholder="0.00" className="w-28 bg-primary p-1 rounded border border-primary-light text-right" />
                        </div>
                         <div className="flex justify-between items-center">
                            <label htmlFor="discount" className="text-gray-400">Discount</label>
                            <input id="discount" value={discount} onChange={e => setDiscount(e.target.value)} type="number" placeholder="0.00" className="w-28 bg-primary p-1 rounded border border-primary-light text-right" />
                        </div>
                         <hr className="border-primary-light" />
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total</span>
                            <span className="font-mono text-accent">{grandTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                        </div>
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
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 no-print gap-2">
                <button onClick={() => setView('list')} className="bg-primary-light text-white font-bold py-2 px-4 rounded hover:opacity-90 w-full sm:w-auto">&larr; Back to Invoices</button>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                    {selectedInvoice && selectedInvoice.status !== 'Paid' && (
                        <button onClick={() => handleMarkAsPaid(selectedInvoice.id)} className="flex-1 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                            Mark as Paid
                        </button>
                    )}
                    <button onClick={handlePrint} className="flex-1 bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Print / PDF</button>
                </div>
            </div>
            
            <style>{`
                @media print {
                    body { 
                        background-color: #041401 !important; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    body * { visibility: hidden; }
                    .printable-area, .printable-area * { visibility: visible; }
                    .printable-area { 
                        position: absolute; 
                        left: 0; 
                        top: 0; 
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        border: none;
                    }
                    .no-print { display: none !important; }
                }
            `}</style>
            
            <Card id="invoice-printable" className="max-w-4xl mx-auto p-6 sm:p-12 printable-area">
                <header className="flex flex-col sm:flex-row justify-between items-start pb-8 border-b border-primary">
                    <div>
                        <Logo className="text-5xl" />
                        <p className="text-gray-400 mt-2">{user?.companyName}</p>
                        <p className="text-gray-400">{user?.email}</p>
                    </div>
                    <div className="text-left sm:text-right mt-4 sm:mt-0">
                        <h1 className="text-4xl font-bold text-white">INVOICE</h1>
                        <p className="text-gray-400 mt-2"># {selectedInvoice?.id}</p>
                        <div className="mt-2"><StatusBadge status={selectedInvoice?.status || 'Unpaid'}/></div>
                    </div>
                </header>
                <section className="flex flex-col sm:flex-row justify-between my-8">
                    <div>
                        <p className="font-semibold text-gray-400 mb-1">BILLED TO</p>
                        <h3 className="text-xl font-bold text-white">{selectedInvoice?.client.name}</h3>
                        <p className="text-gray-300">{selectedInvoice?.client.address}</p>
                        <p className="text-gray-300">{selectedInvoice?.client.email}</p>
                    </div>
                    <div className="text-left sm:text-right mt-4 sm:mt-0">
                        <p className="font-semibold text-gray-400">Issue Date: <span className="text-white font-normal">{selectedInvoice?.issueDate}</span></p>
                        <p className="font-semibold text-gray-400">Due Date: <span className="text-white font-normal">{selectedInvoice?.dueDate}</span></p>
                    </div>
                </section>
                <section className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-primary rounded-t-lg">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide rounded-tl-lg">Description</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-center">Qty</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-right">Unit Price</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-right rounded-tr-lg">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary">
                            {selectedInvoice?.items.map(item => (
                                <tr key={item.id}>
                                    <td className="p-3 text-white">{item.description}</td>
                                    <td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-right font-mono">{item.price.toLocaleString('en-US', { style: 'currency', currency: selectedInvoice!.currency })}</td>
                                    <td className="p-3 text-right font-mono">{(item.quantity * item.price).toLocaleString('en-US', { style: 'currency', currency: selectedInvoice!.currency })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <section className="flex flex-col sm:flex-row justify-between mt-8">
                    <div className="sm:w-1/2 text-gray-300 text-sm">
                        {selectedInvoice?.notes && (
                            <>
                                <h4 className="font-bold text-white mb-1">Notes</h4>
                                <p>{selectedInvoice.notes}</p>
                            </>
                        )}
                    </div>
                    <div className="w-full sm:w-1/2 max-w-xs space-y-3 mt-6 sm:mt-0 self-end">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Subtotal:</span>
                            <span className="font-mono">{selectedInvoice?.subtotal.toLocaleString('en-US', { style: 'currency', currency: selectedInvoice.currency })}</span>
                        </div>
                        {selectedInvoice && selectedInvoice.tax > 0 && (
                             <div className="flex justify-between">
                                <span className="text-gray-400">Tax:</span>
                                <span className="font-mono">{selectedInvoice.tax.toLocaleString('en-US', { style: 'currency', currency: selectedInvoice.currency })}</span>
                            </div>
                        )}
                        {selectedInvoice && selectedInvoice.discount > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-400">Discount:</span>
                                <span className="font-mono">-{selectedInvoice.discount.toLocaleString('en-US', { style: 'currency', currency: selectedInvoice.currency })}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-2xl text-accent border-t-2 border-accent pt-3">
                            <span>Total Due:</span>
                            <span className="font-mono">{selectedInvoice?.total.toLocaleString('en-US', { style: 'currency', currency: selectedInvoice.currency })}</span>
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
