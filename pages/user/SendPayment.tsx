
import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import XelooTransfer from './XelooTransfer';

const countries: string[] = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the",
  "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
  "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
  "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const countryToCurrency: { [key: string]: string } = {
    'United States': 'USD', 'China': 'CNY', 'Japan': 'JPY', 'Germany': 'EUR', 'United Kingdom': 'GBP', 'India': 'INR', 'France': 'EUR', 'Italy': 'EUR', 'Brazil': 'BRL', 'Canada': 'CAD', 'Russia': 'RUB', 'South Korea': 'KRW', 'Australia': 'AUD', 'Spain': 'EUR', 'Mexico': 'MXN', 'Indonesia': 'IDR', 'Netherlands': 'EUR', 'Saudi Arabia': 'SAR', 'Turkey': 'TRY', 'Switzerland': 'CHF', 'Taiwan': 'TWD', 'Poland': 'PLN', 'Sweden': 'SEK', 'Belgium': 'EUR', 'Thailand': 'THB', 'Iran': 'IRR', 'Argentina': 'ARS', 'Austria': 'EUR', 'Norway': 'NOK', 'United Arab Emirates': 'AED', 'Nigeria': 'NGN', 'Israel': 'ILS', 'Ireland': 'EUR', 'South Africa': 'ZAR', 'Hong Kong': 'HKD', 'Singapore': 'SGD', 'Denmark': 'DKK', 'Malaysia': 'MYR', 'Philippines': 'PHP', 'Colombia': 'COP', 'Pakistan': 'PKR', 'Chile': 'CLP', 'Finland': 'EUR', 'Bangladesh': 'BDT', 'Egypt': 'EGP', 'Vietnam': 'VND', 'Czech Republic': 'CZK', 'Romania': 'RON', 'Portugal': 'EUR', 'Peru': 'PEN', 'Greece': 'EUR', 'New Zealand': 'NZD', 'Qatar': 'QAR', 'Iraq': 'IQD', 'Kazakhstan': 'KZT', 'Hungary': 'HUF', 'Algeria': 'DZD', 'Ukraine': 'UAH', 'Kuwait': 'KWD', 'Morocco': 'MAD', 'Ecuador': 'USD', 'Slovakia': 'EUR', 'Oman': 'OMR', 'Dominican Republic': 'DOP', 'Sri Lanka': 'LKR', 'Angola': 'AOA', 'Kenya': 'KES', 'Guatemala': 'GTQ', 'Ethiopia': 'ETB', 'Uruguay': 'UYU', 'Myanmar': 'MMK', 'Costa Rica': 'CRC', 'Ghana': 'GHS', 'Panama': 'PAB', 'Bulgaria': 'BGN', 'Tanzania': 'TZS', 'Croatia': 'EUR', 'Belarus': 'BYN', 'Lebanon': 'LBP', 'Uzbekistan': 'UZS', 'Lithuania': 'EUR', 'Serbia': 'RSD', 'Slovenia': 'EUR', 'Tunisia': 'TND', 'Turkmenistan': 'TMT', 'Azerbaijan': 'AZN', 'Bolivia': 'BOB', 'Jordan': 'JOD', 'Paraguay': 'PYG', 'Latvia': 'EUR', 'Bahrain': 'BHD', 'Estonia': 'EUR', 'Cyprus': 'EUR', 'Trinidad and Tobago': 'TTD', 'Honduras': 'HNL', 'Georgia': 'GEL', 'El Salvador': 'USD', 'Bosnia and Herzegovina': 'BAM', 'Iceland': 'ISK', 'Jamaica': 'JMD', 'Libya': 'LYD', 'Armenia': 'AMD', 'Albania': 'ALL', 'Luxembourg': 'EUR', 'Mozambique': 'MZN', 'Nepal': 'NPR', 'Mongolia': 'MNT', 'Cambodia': 'KHR', 'Malta': 'EUR', 'Namibia': 'NAD', 'North Macedonia': 'MKD', 'Senegal': 'XOF', 'Zambia': 'ZMW', 'Zimbabwe': 'ZWL',
};

const MOCK_RATES: { [key: string]: number } = {
    USD: 1, CNY: 7.25, JPY: 157.5, EUR: 0.92, GBP: 0.79, INR: 83.4, BRL: 5.25, CAD: 1.37, RUB: 88.0, KRW: 1380.0, AUD: 1.5, MXN: 17.5, IDR: 16250.0, CHF: 0.9, SAR: 3.75, TRY: 32.5, TWD: 32.3, PLN: 3.95, SEK: 10.45, THB: 36.6, IRR: 42000.0, ARS: 890.0, NOK: 10.5, AED: 3.67, NGN: 1480.0, ILS: 3.7, ZAR: 18.5, HKD: 7.8, SGD: 1.35, DKK: 6.85, MYR: 4.7, PHP: 58.6, COP: 3900.0, PKR: 278.0, CLP: 925.0, BDT: 117.0, EGP: 47.5, VND: 25400.0, CZK: 22.8, RON: 4.6, PEN: 3.75, NZD: 1.62, QAR: 3.64, IQD: 1310.0, KZT: 445.0, HUF: 360.0, DZD: 134.5, UAH: 40.5, KWD: 0.3, MAD: 10.0, AOA: 830.0, KES: 130.0, GTQ: 7.75, ETB: 57.0, UYU: 39.0, MMK: 2100.0, CRC: 515.0, GHS: 14.5, PAB: 1.0, BGN: 1.8, TZS: 2600.0, BYN: 3.25, LBP: 89500.0, UZS: 12650.0, RSD: 108.0, TND: 3.12, TMT: 3.5, AZN: 1.7, BOB: 6.9, JOD: 0.71, PYG: 7500.0, BHD: 0.38, TTD: 6.75, HNL: 24.6, GEL: 2.8, BAM: 1.8, ISK: 138.0, JMD: 155.0, LYD: 4.85, AMD: 388.0, ALL: 93.0, MZN: 63.5, NPR: 133.0, MNT: 3400.0, KHR: 4100.0, NAD: 18.5, MKD: 56.5, XOF: 605.0, ZMW: 25.5, ZWL: 13.5,
};

interface Recipient {
    id: string;
    name: string;
    country: string;
    accountNumber: string;
    routingNumber?: string;
    bankName: string;
    email: string;
}

const mockRecipients: Recipient[] = [
    { id: 'rec_1', name: 'Acme Inc.', country: 'United States', accountNumber: '**** **** **** 1234', routingNumber: '123456789', bankName: 'Chase Bank', email: 'billing@acme.com' },
    { id: 'rec_2', name: 'Lagos Ventures', country: 'Nigeria', accountNumber: '**** **** **** 5678', bankName: 'Access Bank', email: 'accounts@lagosventures.ng' },
    { id: 'rec_3', name: 'Beijing Tech', country: 'China', accountNumber: '**** **** **** 9876', bankName: 'Bank of China', email: 'contact@beijingtech.cn' },
];

const SendPayment: React.FC = () => {
    const { user } = useAuth();
    const defaultAccount = user?.bankAccounts?.find(a => a.isDefault) || user?.bankAccounts?.[0];

    const [activeTab, setActiveTab] = useState<'bank' | 'xeloo'>('bank');
    const [amount, setAmount] = useState('');
    const [fromAccountId, setFromAccountId] = useState(defaultAccount?.id || '');
    
    // Recipient state
    const [recipients, setRecipients] = useState(mockRecipients);
    const [selectedRecipientId, setSelectedRecipientId] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientCountry, setRecipientCountry] = useState('Nigeria');
    const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
    const [recipientRoutingNumber, setRecipientRoutingNumber] = useState('');
    const [recipientBankName, setRecipientBankName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [saveRecipient, setSaveRecipient] = useState(false);
    
    // Rate & calculation state
    const [rates, setRates] = useState(MOCK_RATES);
    const [rateJustUpdated, setRateJustUpdated] = useState(false);
    const [commission, setCommission] = useState(0);
    const [total, setTotal] = useState(0);
    const [receivedAmount, setReceivedAmount] = useState(0);
    
    // UI/Flow state
    const [isConfirming, setIsConfirming] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Scheduling state
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');


    const fromCurrency = user?.bankAccounts?.find(acc => acc.id === fromAccountId)?.currency || 'USD';
    const toCurrency = countryToCurrency[recipientCountry] || 'USD';
    
    useEffect(() => {
        if (selectedRecipientId && selectedRecipientId !== 'new') {
            const recipient = recipients.find(r => r.id === selectedRecipientId);
            if (recipient) {
                setRecipientName(recipient.name);
                setRecipientCountry(recipient.country);
                setRecipientAccountNumber(recipient.accountNumber);
                setRecipientRoutingNumber(recipient.routingNumber || '');
                setRecipientBankName(recipient.bankName);
                setRecipientEmail(recipient.email);
            }
        } else {
             setRecipientName('');
             setRecipientAccountNumber('');
             setRecipientRoutingNumber('');
             setRecipientBankName('');
             setRecipientEmail('');
        }
    }, [selectedRecipientId, recipients]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRates(prevRates => {
                const newRates = { ...prevRates };
                for (const currency in newRates) {
                    if (currency !== 'USD') {
                        const factor = 1 + (Math.random() - 0.5) * 0.01; // Fluctuate by +/- 0.5%
                        newRates[currency] = prevRates[currency] * factor;
                    }
                }
                return newRates;
            });
            setRateJustUpdated(true);
            setTimeout(() => setRateJustUpdated(false), 1000);
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && numAmount > 0 && rates[fromCurrency] && rates[toCurrency]) {
            const calculatedCommission = numAmount * 0.015;
            setCommission(calculatedCommission);
            setTotal(numAmount + calculatedCommission);
            
            const baseAmount = numAmount / rates[fromCurrency]; // Convert to USD base
            const convertedAmount = baseAmount * rates[toCurrency];
            setReceivedAmount(convertedAmount);
        } else {
            setCommission(0);
            setTotal(0);
            setReceivedAmount(0);
        }
    }, [amount, rates, fromCurrency, toCurrency]);

    const handleInitiatePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentError('');
        setIsConfirming(true);
    };

    const handleConfirmPayment = () => {
        setIsProcessing(true);
        setPaymentError('');

        // Simulate API call with random failure
        setTimeout(() => {
            if (Math.random() < 0.2) { // 20% chance of failure
                setPaymentError('Transaction failed due to an unexpected issue. Please try again.');
                setIsProcessing(false);
                return;
            }

            if (saveRecipient && selectedRecipientId === 'new') {
                const newRecipient: Recipient = {
                    id: `rec_${Date.now()}`,
                    name: recipientName,
                    country: recipientCountry,
                    accountNumber: `**** **** **** ${recipientAccountNumber.slice(-4)}`,
                    routingNumber: recipientRoutingNumber,
                    bankName: recipientBankName,
                    email: recipientEmail,
                };
                setRecipients(prev => [...prev, newRecipient]);
            }
            
            setIsProcessing(false);
            setIsConfirming(false);
            setIsSuccess(true);
            setSuccessMessage(isScheduled
                ? `Payment successfully scheduled for ${scheduleDate}!`
                : 'Payment Sent Successfully!'
            );
            setAmount('');
            setSelectedRecipientId('');
        }, 2000);
    };

    const resetForm = () => {
        setIsSuccess(false);
        setSuccessMessage('');
        setAmount('');
        setSelectedRecipientId('');
        setRecipientName('');
        setRecipientCountry('Nigeria');
        setRecipientAccountNumber('');
        setRecipientRoutingNumber('');
        setRecipientBankName('');
        setRecipientEmail('');
        setSaveRecipient(false);
        setIsScheduled(false);
        setScheduleDate('');
    };

    if (isSuccess) {
        return (
            <Card className="max-w-lg mx-auto text-center">
                <h2 className="text-2xl font-bold text-accent mb-4">{successMessage}</h2>
                <p className="text-gray-300 mb-6">The transaction details have been recorded.</p>
                <button onClick={resetForm} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                    Make Another Payment
                </button>
            </Card>
        );
    }

    return (
        <>
            <div className="max-w-2xl mx-auto mb-6">
                <div className="flex space-x-2 p-1 bg-primary rounded-lg">
                    <button
                        onClick={() => setActiveTab('bank')}
                        className={`w-full text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'bank' ? 'bg-accent text-primary' : 'text-gray-300 hover:bg-primary-light'}`}
                    >
                        Bank Transfer
                    </button>
                    <button
                        onClick={() => setActiveTab('xeloo')}
                        className={`w-full text-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'xeloo' ? 'bg-accent text-primary' : 'text-gray-300 hover:bg-primary-light'}`}
                    >
                        Xeloo Transfer (Free & Instant)
                    </button>
                </div>
            </div>

            {activeTab === 'xeloo' && <XelooTransfer />}

            {activeTab === 'bank' && (
                <>
                    <Card className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">Send Payment Globally</h2>
                        <form onSubmit={handleInitiatePayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Send From</label>
                                <select value={fromAccountId} onChange={e => setFromAccountId(e.target.value)} className="mt-1 w-full bg-primary p-2 rounded border border-primary-light">
                                    {user?.bankAccounts?.map(acc => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.bankName} ({acc.currency}) - {acc.accountNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Amount to Send ({fromCurrency})</label>
                                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" required />
                            </div>

                            <fieldset className="border border-primary-light rounded p-4 space-y-4">
                                <legend className="text-lg font-semibold px-2">Recipient</legend>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Saved Recipient</label>
                                    <select value={selectedRecipientId} onChange={e => setSelectedRecipientId(e.target.value)} className="mt-1 w-full bg-primary p-2 rounded border border-primary-light">
                                        <option value="">Select a recipient</option>
                                        {recipients.map(r => <option key={r.id} value={r.id}>{r.name} - {r.country}</option>)}
                                        <option value="new">-- Add New Recipient --</option>
                                    </select>
                                </div>

                                {(selectedRecipientId === 'new' || !selectedRecipientId) && (
                                    <>
                                        <input type="text" placeholder="Recipient's Full Name or Company" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light" required />
                                        <select value={recipientCountry} onChange={e => setRecipientCountry(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light">
                                            {countries.map(country => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                        <input type="text" placeholder="Account Number" value={recipientAccountNumber} onChange={e => setRecipientAccountNumber(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light" required />
                                        <input type="text" placeholder="Routing Number (if applicable)" value={recipientRoutingNumber} onChange={e => setRecipientRoutingNumber(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light" />
                                        <input type="text" placeholder="Bank Name" value={recipientBankName} onChange={e => setRecipientBankName(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light" required />
                                        <input type="email" placeholder="Recipient's Email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} className="w-full bg-primary p-2 rounded border border-primary-light" required />
                                        {selectedRecipientId === 'new' && (
                                            <div className="flex items-center">
                                                <input id="save-recipient" type="checkbox" checked={saveRecipient} onChange={e => setSaveRecipient(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
                                                <label htmlFor="save-recipient" className="ml-2 block text-sm text-gray-400">Save recipient for future payments</label>
                                            </div>
                                        )}
                                    </>
                                )}
                            </fieldset>
                            
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <input id="schedule-payment" type="checkbox" checked={isScheduled} onChange={e => setIsScheduled(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
                                    <label htmlFor="schedule-payment" className="ml-2 block text-sm text-gray-400">Schedule for later?</label>
                                </div>
                                {isScheduled && (
                                    <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} required={isScheduled} min={new Date().toISOString().split("T")[0]} className="bg-primary p-2 rounded border border-primary-light" />
                                )}
                            </div>

                            {total > 0 && (
                            <div className="bg-primary p-4 rounded-lg space-y-3">
                                <div className={`flex justify-between items-center text-gray-400 transition-colors duration-500 ${rateJustUpdated ? 'text-accent' : ''}`}>
                                    <span>Exchange Rate:</span>
                                    <span className="font-mono text-white">1 {fromCurrency} ≈ {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-400">
                                    <span>Recipient Gets:</span>
                                    <span className="font-mono text-accent font-bold">{receivedAmount.toLocaleString('en-US', { style: 'currency', currency: toCurrency, minimumFractionDigits: 2 })}</span>
                                </div>
                                <hr className="border-primary" />
                                <div className="flex justify-between items-center text-gray-400">
                                    <span>Commission (1.5%):</span>
                                    <span className="font-mono text-white">{commission.toLocaleString('en-US', { style: 'currency', currency: fromCurrency })}</span>
                                </div>
                                <div className="flex justify-between items-center text-white font-bold text-lg">
                                    <span>You Pay:</span>
                                    <span className="font-mono text-accent">{total.toLocaleString('en-US', { style: 'currency', currency: fromCurrency })}</span>
                                </div>
                            </div>
                            )}
                            
                            <button type="submit" disabled={!amount} className="w-full bg-accent text-primary font-bold py-3 px-4 rounded hover:opacity-90 disabled:bg-gray-500 disabled:cursor-not-allowed flex justify-center items-center">
                                {isScheduled ? 'Schedule Payment' : 'Confirm & Send'}
                            </button>
                        </form>
                    </Card>

                    {isConfirming && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
                            <Card className="max-w-md w-full">
                                <h2 className="text-2xl font-bold mb-4">{isScheduled ? 'Confirm Schedule' : 'Confirm Payment'}</h2>
                                <div className="space-y-2 text-gray-300 mb-6">
                                    <p><strong>Sending:</strong> <span className="font-mono text-accent">{total.toLocaleString('en-US', { style: 'currency', currency: fromCurrency })}</span></p>
                                    <p><strong>To:</strong> <span className="text-white">{recipientName}</span></p>
                                    <p><strong>Recipient Gets:</strong> <span className="font-mono text-accent">{receivedAmount.toLocaleString('en-US', { style: 'currency', currency: toCurrency })}</span></p>
                                    {isScheduled && <p><strong>Scheduled for:</strong> <span className="text-white">{scheduleDate}</span></p>}
                                </div>

                                {paymentError && <p className="text-yellow-400 text-center mb-4">{paymentError}</p>}
                                
                                <div className="flex justify-end space-x-4">
                                    <button onClick={() => setIsConfirming(false)} disabled={isProcessing} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600 disabled:opacity-50">
                                        Cancel
                                    </button>
                                    <button onClick={handleConfirmPayment} disabled={isProcessing} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 disabled:bg-gray-500 flex items-center justify-center w-40">
                                        {isProcessing ? <Spinner /> : isScheduled ? 'Confirm Schedule' : 'Confirm & Send'}
                                    </button>
                                </div>
                            </Card>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default SendPayment;