import React, { useState, useMemo, useEffect } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { CheckCircleIcon, UsersIcon } from '../../components/icons/Icons';
import { Employee } from '../../types';

// --- MOCK DATA & TYPES ---
const MOCK_RATES: { [key: string]: number } = { USD: 1, NGN: 1480.0, GHS: 14.5, KES: 130.0, GBP: 0.79, EUR: 0.92, CAD: 1.37 };
const countryToCurrency: { [key: string]: string } = { 'USA': 'USD', 'Nigeria': 'NGN', 'Ghana': 'GHS', 'Kenya': 'KES', 'UK': 'GBP', 'Germany': 'EUR', 'Canada': 'CAD' };
const countries = Object.keys(countryToCurrency);

const mockEmployees: Employee[] = [
    { id: 'emp_1', name: 'Adebayo Adekunle', email: 'adebayo@example.com', country: 'Nigeria', currency: 'NGN', salary: 750000, paymentMethod: 'bank', bankName: 'GTBank', accountNumber: '0123456789' },
    { id: 'emp_2', name: 'Kwame Osei', email: 'kwame@example.com', country: 'Ghana', currency: 'GHS', salary: 4000, paymentMethod: 'bank', bankName: 'EcoBank', accountNumber: '1234567890' },
    { id: 'emp_3', name: 'Jane Smith', email: 'jane.s@example.com', country: 'UK', currency: 'GBP', salary: 3000, paymentMethod: 'bank', bankName: 'Barclays', accountNumber: '20-05-05 12345678', swiftCode: 'BARCGB22', iban: 'GB29 NWBK 6016 1331 9268 19' },
    { id: 'emp_4', name: 'Sam Wilson', email: 'sam@xeloo.user', country: 'USA', currency: 'USD', salary: 2500, paymentMethod: 'xeloo', xelooUsername: 'samwilson' },
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
    const [paymentMethod, setPaymentMethod] = useState<'bank' | 'xeloo'>(employee?.paymentMethod || 'bank');
    const [bankName, setBankName] = useState(employee?.bankName || '');
    const [accountNumber, setAccountNumber] = useState(employee?.accountNumber || '');
    const [routingNumber, setRoutingNumber] = useState(employee?.routingNumber || '');
    const [swiftCode, setSwiftCode] = useState(employee?.swiftCode || '');
    const [iban, setIban] = useState(employee?.iban || '');
    const [xelooUsername, setXelooUsername] = useState(employee?.xelooUsername || '');

    // New salary state
    const displayCurrency = user?.preferredCurrency || 'USD';
    const localCurrency = useMemo(() => countryToCurrency[country], [country]);
    const [activeInput, setActiveInput] = useState<'local' | 'display'>('local');
    const [salaryLocal, setSalaryLocal] = useState('');
    const [salaryDisplay, setSalaryDisplay] = useState('');
    const [rate, setRate] = useState(0);

    const currencyToSymbol: { [key: string]: string } = { USD: '$', NGN: '₦', GHS: '₵', KES: 'KSh', GBP: '£', EUR: '€', CAD: '$' };

    useEffect(() => {
        if (employee) {
            setSalaryLocal(employee.salary.toString());
            // Trigger calculation for display currency
            const fromRate = MOCK_RATES[employee.currency] || 0;
            const toRate = MOCK_RATES[displayCurrency] || 0;
            if (fromRate > 0 && toRate > 0) {
                const valueInBase = employee.salary / fromRate;
                setSalaryDisplay((valueInBase * toRate).toFixed(2));
            }
        }
    }, [employee, displayCurrency]);

    useEffect(() => {
        const rateDisplay = MOCK_RATES[displayCurrency] || 0;
        const rateLocal = MOCK_RATES[localCurrency] || 0;
        if (rateDisplay === 0 || rateLocal === 0) return;

        const effectiveRate = rateLocal / rateDisplay;
        setRate(effectiveRate);

        if (activeInput === 'display') {
            const display = parseFloat(salaryDisplay);
            if (!isNaN(display) && display > 0) {
                const local = display * effectiveRate;
                setSalaryLocal(local.toFixed(2));
            } else {
                setSalaryLocal('');
            }
        } else if (activeInput === 'local') {
            const local = parseFloat(salaryLocal);
            if (!isNaN(local) && local > 0) {
                const display = local / effectiveRate;
                setSalaryDisplay(display.toFixed(2));
            } else {
                setSalaryDisplay('');
            }
        }
    }, [salaryLocal, salaryDisplay, localCurrency, displayCurrency, activeInput]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: employee?.id,
            name,
            email,
            country,
            currency: localCurrency,
            salary: parseFloat(salaryLocal),
            paymentMethod,
            bankName: paymentMethod === 'bank' ? bankName : undefined,
            accountNumber: paymentMethod === 'bank' ? accountNumber : undefined,
            routingNumber: paymentMethod === 'bank' ? routingNumber : undefined,
            swiftCode: paymentMethod === 'bank' ? swiftCode : undefined,
            iban: paymentMethod === 'bank' ? iban : undefined,
            xelooUsername: paymentMethod === 'xeloo' ? xelooUsername : undefined,
        });
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-6">{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email Address" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                
                <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Set Salary</label>
                    <div className="space-y-2">
                        <div className="bg-primary p-3 rounded-lg">
                            <label className="text-xs text-gray-400">In Your Currency ({displayCurrency})</label>
                            <div className="flex items-center">
                                <span className="text-xl text-gray-400 mr-2">{currencyToSymbol[displayCurrency]}</span>
                                <input type="number" value={salaryDisplay} onChange={e => setSalaryDisplay(e.target.value)} onFocus={() => setActiveInput('display')} placeholder="0.00" className="w-full bg-transparent text-xl text-white focus:outline-none" />
                            </div>
                        </div>

                        <div className="text-center text-xs text-accent font-mono">1 {displayCurrency} ≈ {rate.toFixed(2)} {localCurrency}</div>

                        <div className="bg-primary p-3 rounded-lg">
                            <label className="text-xs text-gray-400">In Recipient's Currency ({localCurrency})</label>
                             <div className="flex items-center">
                                <span className="text-xl text-gray-400 mr-2">{currencyToSymbol[localCurrency]}</span>
                                <input type="number" value={salaryLocal} onChange={e => setSalaryLocal(e.target.value)} onFocus={() => setActiveInput('local')} placeholder="0.00" className="w-full bg-transparent text-xl text-white focus:outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-400 mb-2 block">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setPaymentMethod('bank')} className={`p-3 rounded-md border-2 text-center text-sm font-semibold ${paymentMethod === 'bank' ? 'border-accent bg-accent/10' : 'border-primary-light bg-primary'}`}>Bank Transfer</button>
                        <button type="button" onClick={() => setPaymentMethod('xeloo')} className={`p-3 rounded-md border-2 text-center text-sm font-semibold ${paymentMethod === 'xeloo' ? 'border-accent bg-accent/10' : 'border-primary-light bg-primary'}`}>Xeloo User</button>
                    </div>
                </div>

                {paymentMethod === 'bank' ? (
                    <div className="space-y-4 pt-2 border-t border-primary-light">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Bank Name" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                             <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Account Number" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                             <input value={swiftCode} onChange={e => setSwiftCode(e.target.value)} placeholder="SWIFT/BIC Code (Optional)" className="w-full bg-primary p-2 rounded border border-primary-light" />
                             <input value={iban} onChange={e => setIban(e.target.value)} placeholder="IBAN (Optional)" className="w-full bg-primary p-2 rounded border border-primary-light" />
                             <input value={routingNumber} onChange={e => setRoutingNumber(e.target.value)} placeholder="Routing Number (Optional)" className="w-full bg-primary p-2 rounded border border-primary-light" />
                             <div>
                                <select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light h-full">
                                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                ) : (
                     <div className="pt-2 border-t border-primary-light">
                        <input value={xelooUsername} onChange={e => setXelooUsername(e.target.value)} placeholder="Employee's @username" className="w-full bg-primary p-2 rounded border border-primary-light" required />
                    </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Cancel</button>
                    <button type="submit" className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Save Employee</button>
                </div>
            </form>
        </Card>
    );
};

interface PayrollProps {
    searchQuery: string;
}

const Payroll: React.FC<PayrollProps> = ({ searchQuery }) => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [view, setView] = useState<'list' | 'form' | 'confirm' | 'payin' | 'processing' | 'success'>('list');
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const displayCurrency = user?.preferredCurrency || 'USD';

    const filteredEmployees = useMemo(() => {
        if (!searchQuery) return employees;
        const lowercasedQuery = searchQuery.toLowerCase();
        return employees.filter(emp =>
            emp.name.toLowerCase().includes(lowercasedQuery) ||
            emp.email.toLowerCase().includes(lowercasedQuery)
        );
    }, [employees, searchQuery]);

    const totalPayrollUSD = useMemo(() => {
        return filteredEmployees.reduce((total, emp) => {
            const rate = MOCK_RATES[emp.currency] || 0;
            return total + (rate > 0 ? emp.salary / rate : 0);
        }, 0);
    }, [filteredEmployees]);
    
    const totalPayrollDisplayCurrency = totalPayrollUSD * (MOCK_RATES[displayCurrency] || 1);


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

    const handleConfirmPayroll = () => setView('payin');
    
    const handleFundPayroll = () => {
        setView('processing');
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
                    A total of {totalPayrollDisplayCurrency.toLocaleString('en-US', { style: 'currency', currency: displayCurrency })} has been processed for {filteredEmployees.length} employees.
                </p>
                <button onClick={() => setView('list')} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                    Back to Payroll
                </button>
            </Card>
        );
    }
    
    if (view === 'processing') {
        return (
            <Card className="text-center max-w-2xl mx-auto">
                <Spinner className="w-12 h-12 mx-auto border-4" />
                <h2 className="text-2xl font-bold mt-4">Processing Payroll...</h2>
                <p className="text-gray-400 mt-2">We are confirming your deposit and initiating payouts to your employees.</p>
            </Card>
        );
    }

    if (view === 'payin') {
        const fundingAmount = totalPayrollUSD * MOCK_RATES['NGN'];
        return (
             <Card className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-2">Fund Payroll Run</h2>
                <p className="text-gray-400 mb-4">To proceed, please deposit the total payroll amount to the unique account details below. This ensures all your employees are paid in a single batch.</p>
                <div className="bg-primary p-4 rounded-lg space-y-3">
                    <div className="text-center mb-2">
                        <p className="text-sm text-gray-400">Total Amount to Deposit (NGN)</p>
                        <p className="text-3xl font-bold text-accent font-mono">{fundingAmount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</p>
                         <p className="text-sm text-gray-400">~ {totalPayrollDisplayCurrency.toLocaleString('en-US', { style: 'currency', currency: displayCurrency })}</p>
                    </div>
                    <div className="flex justify-between"><span className="text-gray-400">Bank Name:</span> <strong className="text-white">Xeloo Payroll (Providus)</strong></div>
                    <div className="flex justify-between"><span className="text-gray-400">Account Number:</span> <strong className="font-mono text-white">7{Math.floor(100000000 + Math.random() * 900000000)}</strong></div>
                    <div className="flex justify-between"><span className="text-gray-400">Beneficiary:</span> <strong className="text-white">XELOO/{user?.companyName?.replace(' ', '').toUpperCase()}</strong></div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={() => setView('confirm')} className="bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">Back</button>
                    <button onClick={handleFundPayroll} className="w-full mt-6 bg-accent text-primary font-bold py-3 px-4 rounded hover:opacity-90">I Have Made The Deposit</button>
                </div>
            </Card>
        )
    }

    if (view === 'confirm') {
        return (
            <Card className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Confirm Payroll Run</h2>
                <p className="text-gray-light mb-6">Review the payment details below. A total of ~{totalPayrollDisplayCurrency.toLocaleString('en-US', { style: 'currency', currency: displayCurrency })} will be required to fund this payroll.</p>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {filteredEmployees.map(emp => (
                        <div key={emp.id} className="p-3 bg-primary rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-white">{emp.name}</p>
                                {emp.paymentMethod === 'bank' ? (
                                    <p className="text-sm text-gray-400">{emp.bankName} - {emp.accountNumber}</p>
                                ) : (
                                    <p className="text-sm text-accent">@{emp.xelooUsername}</p>
                                )}
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
                    <button onClick={handleConfirmPayroll} disabled={isProcessing} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 w-48 flex items-center justify-center">
                        {isProcessing ? <Spinner /> : 'Confirm & Proceed'}
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
                        <button onClick={() => { setEditingEmployee(null); setView('form'); }} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Add Employee</button>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-400 uppercase bg-primary">
                                <tr>
                                    <th className="px-6 py-3">Employee</th>
                                    <th className="px-6 py-3">Salary</th>
                                    <th className="px-6 py-3">Payment Method</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map(emp => (
                                    <tr key={emp.id} className="bg-primary-light border-b border-primary">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{emp.name}</div>
                                            <div className="text-xs">{emp.country}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-mono">{emp.salary.toLocaleString(undefined, { maximumFractionDigits: 2 })} {emp.currency}</div>
                                            <div className="text-xs font-mono text-gray-500">~ {getEquivalentValue(emp.salary, emp.currency)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {emp.paymentMethod === 'bank' ? (
                                                <>{emp.bankName} <br /> {emp.accountNumber}</>
                                            ) : (
                                                <span className="flex items-center gap-1 font-bold text-accent"><UsersIcon className="w-4 h-4" /> @{emp.xelooUsername}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => { setEditingEmployee(emp); setView('form'); }} className="font-medium text-accent hover:underline text-xs">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredEmployees.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-400">No employees found.</td>
                                    </tr>
                                )}
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
                        <p className="text-2xl font-bold text-white">{filteredEmployees.length}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Estimated Monthly Payroll</p>
                        <p className="text-3xl font-bold text-accent">{totalPayrollDisplayCurrency.toLocaleString('en-US', { style: 'currency', currency: displayCurrency })}</p>
                    </div>
                    <button onClick={() => setView('confirm')} disabled={filteredEmployees.length === 0} className="w-full bg-accent text-primary font-bold py-3 px-4 rounded hover:opacity-90 disabled:bg-gray-500 disabled:cursor-not-allowed">
                        Run Payroll
                    </button>
                </Card>
            </div>
        </div>
    )
};

export default Payroll;