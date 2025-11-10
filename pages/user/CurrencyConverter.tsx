
import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import { ConverterIcon } from '../../components/icons/Icons';

const INITIAL_MOCK_RATES: { [key: string]: number } = {
    USD: 1,
    NGN: 1450.50,
    GHS: 13.10,
    KES: 129.50,
    GBP: 0.79,
    EUR: 0.92,
};
const FX_SPREAD_PERCENT = 0.09;

const CurrencyConverter: React.FC = () => {
    const [amount, setAmount] = useState('100');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('NGN');
    const [result, setResult] = useState(0);
    const [rates, setRates] = useState(INITIAL_MOCK_RATES);
    const [effectiveRate, setEffectiveRate] = useState(0);

    // Simulate real-time rate fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setRates(prevRates => {
                const newRates = { ...prevRates };
                for (const currency in newRates) {
                    if (currency !== 'USD') {
                        // Fluctuate by +/- 0.5%
                        const factor = 1 + (Math.random() - 0.5) * 0.01;
                        newRates[currency] = prevRates[currency] * factor;
                    }
                }
                return newRates;
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && rates[fromCurrency] && rates[toCurrency]) {
            const baseRate = rates[toCurrency] / rates[fromCurrency];
            const rateWithSpread = baseRate * (1 - FX_SPREAD_PERCENT / 100);
            setEffectiveRate(rateWithSpread);

            const convertedAmount = numAmount * rateWithSpread;
            setResult(convertedAmount);
        } else {
            setResult(0);
            setEffectiveRate(0);
        }
    }, [amount, fromCurrency, toCurrency, rates]);

    return (
        <Card className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Currency Conversion Tool</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* From */}
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-400">You send</label>
                    <div className="flex mt-1">
                        <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="bg-primary p-3 rounded-l-md border border-primary-light appearance-none">
                            {Object.keys(rates).map(curr => <option key={curr}>{curr}</option>)}
                        </select>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-primary-light p-3 rounded-r-md border-t border-b border-r border-primary-light text-right font-mono text-xl" />
                    </div>
                </div>
                
                <div className="py-2 md:pt-6">
                    <ConverterIcon className="w-8 h-8 text-accent transform md:transform-none rotate-90"/>
                </div>

                {/* To */}
                <div className="w-full">
                    <label className="block text-sm font-medium text-gray-400">They receive (approx.)</label>
                     <div className="flex mt-1">
                        <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="bg-primary p-3 rounded-l-md border border-primary-light appearance-none">
                            {Object.keys(rates).map(curr => <option key={curr}>{curr}</option>)}
                        </select>
                        <input type="text" value={result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} readOnly className="w-full bg-primary-light p-3 rounded-r-md border-t border-b border-r border-primary-light text-right font-mono text-xl text-accent" />
                    </div>
                </div>
            </div>
            <div className="text-center mt-6 text-gray-400">
                1 {fromCurrency} ≈ {effectiveRate.toFixed(4)} {toCurrency}
            </div>
        </Card>
    );
};

export default CurrencyConverter;
