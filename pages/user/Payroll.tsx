
import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircleIcon } from '../../components/icons/Icons';

// --- MOCK DATA & TYPES ---
interface Employee {
    id: string;
    name: string;
    email: string;
    country: string;
    currency: string;
    salary: number;
}
const MOCK_RATES: { [key: string]: number } = {
    USD: 1, NGN: 1480.0, GHS: 14.5, KES: 130.0, GBP: 0.79, EUR: 0.92,
};

const mockEmployees: Employee[] = [
    { id: 'emp_1', name: 'Adebayo Adekunle', email: 'adebayo@example.com', country: 'Nigeria', currency: 'NGN', salary: 750000 },
    { id: 'emp_2', name: 'Kwame Osei', email: 'kwame@example.com', country: 'Ghana', currency: 'GHS', salary: 4000 },
    { id: 'emp_3', name: 'Jane Smith', email: 'jane.s@example.com', country: 'UK', currency: 'GBP', salary: 3000 },
];
// --- END MOCK DATA ---

const Payroll: React.FC = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [view, setView] = useState<'list' | 'add_form' | 'confirm' | 'success'>('list');
    const [isProcessing, setIsProcessing] = useState(false);

    // Form state
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newCurrency, setNewCurrency] = useState('NGN');
    const [newSalary, setNewSalary] = useState('');

    const fromCurrency = user?.preferredCurrency || 'USD';

    const totalPayrollUSD = useMemo(() => {
        return employees.reduce((total, emp) => {
            const rate = MOCK_RATES[emp.currency] || 0;
            const salaryInUSD = rate > 0 ? emp.salary / rate : 0;
            return total + salaryInUSD;
        }, 0);
    }, [employees]);

    const handleAddEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        const newEmployee: Employee = {
            id: `emp_${Date.now()}`,
            name: newName,
            email: newEmail,
            country: 'Unknown', // Could be improved with a country selector
            currency: newCurrency,
            salary: parseFloat(newSalary),
        };
        setEmployees(prev => [...prev, newEmployee]);
        setView('list');
        // Reset form
        setNewName(''); setNewEmail(''); setNewCurrency('NGN'); setNewSalary('');
    };

    const handleRunPayroll = () => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setView('success');
        }, 2000);
    };

    if (view === 'success') {
        return (
            <Card className="max-w-2xl mx-auto text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-400 mb-2">Payroll Submitted!</h2>
                <p className="text-gray-light mb-6">
                    A total of {totalPayrollUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been processed for {employees.length} employees.
                </p>
                <button onClick={() => setView('list')} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                    Back to Payroll
                </button>
            </Card>
        );
    }

    if (view === 'confirm') {
        return (
            <Card className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Confirm Payroll Run</h2>
                <p className="text-gray-light mb-6">Review the payment details below. A total of {totalPayrollUSD.toLocaleString('en-US', { style: 'currency', currency: fromCurrency })} will be deducted from your primary account.</p>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {employees.map(emp => {
                        const rate = MOCK_RATES[emp.currency] || 0;
                        const salaryInUSD = rate > 0 ? emp.salary / rate : 0;
                        return (
                            <div key={emp.id} className="p-3 bg-primary rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-white">{emp.name}</p>
                                    <p className="text-sm text-gray-400">{emp.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono text-accent">{emp.salary.toLocaleString('en-US', { style: 'currency', currency: emp.currency })}</p>
                                    <p className="text-xs font-mono text-gray-400">~ {salaryInUSD.toLocaleString('en-US', { style: 'currency', currency: fromCurrency })}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-primary-light">
                    <button onClick={() => setView('list')} disabled={isProcessing} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                    <button onClick={handleRunPayroll} disabled={isProcessing} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 w-48 flex items-center justify-center">
                        {isProcessing ? <Spinner /> : 'Confirm & Pay'}
                    </button>
                </div>
            </Card>
        );
    }
    
    if (view === 'add_form') {
         return (
            <Card className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
                <form onSubmit={handleAddEmployee} className="space-y-4">
                    <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full Name" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                    <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" placeholder="Email Address" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="text-sm text-gray-400">Currency</label>
                            <select value={newCurrency} onChange={e => setNewCurrency(e.target.value)} className="w-full mt-1 bg-primary p-2 rounded border border-primary-light">
                                {Object.keys(MOCK_RATES).map(curr => <option key={curr} value={curr}>{curr}</option>)}
                            </select>
                        </div>
                        <div className="w-2/3">
                             <label className="text-sm text-gray-400">Salary (in their currency)</label>
                             <input value={newSalary} onChange={e => setNewSalary(e.target.value)} type="number" step="0.01" placeholder="5000" className="w-full mt-1 bg-primary p-2 rounded border border-primary-light" required />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={() => setView('list')} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Add Employee</button>
                    </div>
                </form>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Manage Employees</h2>
                        <button onClick={() => setView('add_form')} className="bg-primary-light text-white font-bold py-2 px-4 rounded hover:opacity-90">Add Employee</button>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-400 uppercase bg-primary">
                                <tr>
                                    <th className="px-6 py-3">Employee</th>
                                    <th className="px-6 py-3">Salary</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(emp => (
                                    <tr key={emp.id} className="bg-primary-light border-b border-primary">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{emp.name}</div>
                                            <div className="text-xs">{emp.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono">{emp.salary.toLocaleString(undefined, { maximumFractionDigits: 2 })} {emp.currency}</td>
                                        <td className="px-6 py-4">
                                            <button className="font-medium text-accent hover:underline text-xs">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="space-y-4 text-center">
                    <h2 className="text-xl font-bold">Payroll Summary</h2>
                    <div>
                        <p className="text-gray-400">Total Employees</p>
                        <p className="text-2xl font-bold text-white">{employees.length}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Estimated Monthly Payroll</p>
                        <p className="text-3xl font-bold text-accent">{totalPayrollUSD.toLocaleString('en-US', { style: 'currency', currency: fromCurrency })}</p>
                    </div>
                    <button onClick={() => setView('confirm')} disabled={employees.length === 0} className="w-full bg-accent text-primary font-bold py-3 px-4 rounded hover:opacity-90 disabled:bg-gray-500 disabled:cursor-not-allowed">
                        Run Payroll
                    </button>
                </Card>
            </div>
        </div>
    )
};

export default Payroll;
