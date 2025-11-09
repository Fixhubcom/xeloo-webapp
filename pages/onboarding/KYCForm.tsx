
import React from 'react';

const KYCForm: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Compliance Information (KYB/AML)</h2>
            <p className="text-sm text-gray-light mb-4">To comply with financial regulations, please provide the following details about your business.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-light">Country of Incorporation</label>
                    <input name="incorporationCountry" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-light">Company Registration Number</label>
                    <input name="registrationNumber" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-light">Registered Business Address</label>
                <input name="businessAddress" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium" />
            </div>

            <fieldset className="border border-gray-medium rounded p-4">
                <legend className="text-lg font-semibold px-2 text-white">Director / Key Person</legend>
                <div className="space-y-4 mt-2">
                    <input name="directorFullName" placeholder="Full Name" className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                    <input name="directorEmail" type="email" placeholder="Email Address" className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                    <input name="directorDOB" type="date" placeholder="Date of Birth" className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                </div>
            </fieldset>

            <fieldset className="border border-gray-medium rounded p-4">
                <legend className="text-lg font-semibold px-2 text-white">Ultimate Beneficial Owners (UBOs)</legend>
                <p className="text-xs text-gray-light mb-2 mt-1">List all individuals who own or control 25% or more of the company.</p>
                <textarea name="ubos" rows={3} placeholder="Full Name, Nationality, % Ownership" className="w-full bg-gray-dark p-2 rounded border border-gray-medium"></textarea>
            </fieldset>

            <div>
                <label className="block text-sm font-medium text-gray-light">Primary Source of Funds</label>
                <select name="sourceOfFunds" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium">
                    <option>Business Operations / Sales Revenue</option>
                    <option>Investor Funding</option>
                    <option>Personal Savings</option>
                    <option>Other</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-light">Expected Monthly Transaction Volume (USD)</label>
                <select name="expectedVolume" className="mt-1 w-full bg-gray-dark p-2 rounded border border-gray-medium">
                    <option>0 - 10,000</option>
                    <option>10,001 - 50,000</option>
                    <option>50,001 - 250,000</option>
                    <option>250,001+</option>
                </select>
            </div>
        </div>
    );
};

export default KYCForm;
