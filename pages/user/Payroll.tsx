
import React, { useState, useMemo, useEffect } from 'react';
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
const MOCK_RATES: { [key: string]: number } = { USD: 1, NGN: 1480.0, GHS: 14.5, KES: 130.0, GBP: 0.79, EUR: 0.92, CAD: 1.37 };
const countryToCurrency: { [key: string]: string } = { 'USA': 'USD', 'Nigeria': 'NGN', 'Ghana': 'GHS', 'Kenya': 'KES', 'UK': 'GBP', 'Germany': 'EUR', 'Canada': 'CAD' };
const countries = Object.keys(countryToCurrency);

const mockEmployees: Employee[] = [
    { id: 'emp_1', name: 'Adebayo Adekunle', email: 'adebayo@example.com', country: 'Nigeria', currency: 'NGN', salary: 750000 },
    { id: 'emp_2', name: 'Kwame Osei', email: 'kwame@example.com', country: 'Ghana', currency: 'GHS', salary: 4000 },
    { id: 'emp_3', name: 'Jane Smith', email: 'jane.s@example.com', country: 'UK', currency: 'GBP', salary: 3000 },
];
// --- END MOCK DATA ---

const EmployeeForm: React.FC<{
    employee?: Employee | null;
    onSave: (employee: Omit<Employee, 'id'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ employee, onSave, onCancel }) => {
    const { user } = useAuth();
    const [name, setName] = useState(employee?.name || '');
    const [email, setEmail] = useState(employee?.email || '');
    const [country, setCountry] = useState(employee?.country || 'Nigeria');
    const [salary, setSalary] = useState(employee?.salary?.toString() || '');
    const [equivalentValue, setEquivalentValue] = useState(0);

    const currency = countryToCurrency[country];
    const displayCurrency = user?.preferredCurrency || 'USD';

    useEffect(() => {
        const numSalary = parseFloat(salary);
        const fromRate = MOCK_RATES[currency] || 0;
        const toRate = MOCK_RATES[displayCurrency] || 0;

        if (!isNaN(numSalary) && fromRate > 0 && toRate > 0) {
            const valueInUSD = numSalary / fromRate;
            setEquivalentValue(valueInUSD * toRate);
        } else {
            setEquivalentValue(0);
        }
    }, [salary, currency, displayCurrency]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: employee?.id,
            name,
            email,
            country,
            currency,
            salary: parseFloat(salary),
        });
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email Address" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="text-sm text-gray-400">Country</label>
                        <select value={country} onChange={e => setCountry(e.target.value)} className="w-full mt-1 bg-primary p-2 rounded border border-primary-light">
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="w-1/2">
                        <label className="text-sm text-gray-400">Salary (in {currency})</label>
                        <input value={salary} onChange={e => setSalary(e.target.value)} type="number" step="0.01" placeholder="5000" className="w-full mt-1 bg-primary p-2 rounded border border-primary-light" required />
                    </div>
                </div>
                {equivalentValue > 0 && (
                    <p className="text-sm text-gray-400 text-right -mt-2">
                        ≈ {equivalentValue.toLocaleString('en-US', { style: 'currency', currency: displayCurrency })}
                    </p>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                    <button type="submit" className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Save Employee</button>
                </div>
            </form>
        </Card>
    );
};

const Payroll: React.FC = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [view, setView] = useState<'list' | 'form' | 'confirm' | 'success'>('list');
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const displayCurrency = user?.preferredCurrency || 'USD';

    const totalPayrollDisplayCurrency = useMemo(() => {
        const totalUSD = employees.reduce((total, emp) => {
            const rate = MOCK_RATES[emp.currency] || 0;
            return total + (rate > 0 ? emp.salary / rate : 0);
        }, 0);
        const displayRate = MOCK_RATES[displayCurrency] || 1;
        return totalUSD * displayRate;
    }, [employees, displayCurrency]);

    const handleSaveEmployee = (employeeData: Omit<Employee, 'id'> & { id?: string }) => {
        if (employeeData.id) {
            // Editing existing employee
            setEmployees(emps => emps.map(e => e.id === employeeData.id ? { ...e, ...employeeData } as Employee : e));
        } else {
            // Adding new employee
            const newEmployee: Employee = {
                id: `emp_${Date.now()}`,
                ...employeeData
            } as Employee;
            setEmployees(prev => [...prev, newEmployee]);
        }
        setView('list');
        setEditingEmployee(null);
    };

    const handleRunPayroll = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setView('success');
        }, 2000);
    };
    
    const getEquivalentValue = (amount: number, currency: string) => {
        const fromRate = MOCK_RATES[currency] || 0;
        const toRate = MOCK_RATES[displayCurrency] || 0;
        if (fromRate > 0 && toRate > 0) {
            const valueInUSD = amount / fromRate;
            return (valueInUSD * toRate).toLocaleString('en-US', { style: 'currency', currency: displayCurrency });
        }
        return 'N/A';
    };

    if (view === 'form') {
        return <EmployeeForm onSave={handleSaveEmployee} onCancel={() => setView('list')} employee={editingEmployee} />;
    }

    if (view === 'success') {
        return (
            <Card className="max-w-2xl mx-auto text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-400 mb-2">Payroll Submitted!</h2>
                <p className="text-gray-light mb-6">
                    A total of {totalPayrollDisplayCurrency.toLocaleString('en-US', { style: 'currency', currency: displayCurrency })} has been processed for {employees.length} employees.
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
                <p className="text-gray-light mb-6">Review the payment details below. A total of {totalPayrollDisplayCurrency.toLocaleString('en-US', { style: 'currency', currency: displayCurrency })} will be deducted from your primary account.</p>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {employees.map(emp => (
                        <div key={emp.id} className="p-3 bg-primary rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-white">{emp.name}</p>
                                <p className="text-sm text-gray-400">{emp.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono text-accent">{emp.salary.toLocaleString('en-US', { style: 'currency', currency: emp.currency })}</p>
                                <p className="text-xs font-mono text-gray-400">~ {getEquivalentValue(emp.salary, emp.currency)}</p>
                            </div>
                        </div>
                    ))}
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Card>
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Manage Employees</h2>
                        <button onClick={() => { setEditingEmployee(null); setView('form'); }} className="bg-primary-light text-white font-bold py-2 px-4 rounded hover:opacity-90">Add Employee</button>
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
                                        <td className="px-6 py-4">
                                            <div className="font-mono">{emp.salary.toLocaleString(undefined, { maximumFractionDigits: 2 })} {emp.currency}</div>
                                            <div className="text-xs font-mono text-gray-500">~ {getEquivalentValue(emp.salary, emp.currency)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => { setEditingEmployee(emp); setView('form'); }} className="font-medium text-accent hover:underline text-xs">Edit</button>
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
                        <p className="text-3xl font-bold text-accent">{totalPayrollDisplayCurrency.toLocaleString('en-US', { style: 'currency', currency: displayCurrency })}</p>
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