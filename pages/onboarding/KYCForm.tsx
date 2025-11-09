
import React, { useState, useRef } from 'react';
import { OnboardingSuggestions } from '../../types';
import { LightbulbIcon, UploadIcon, CheckCircleIcon } from '../../components/icons/Icons';

// --- Reusable File Upload Component ---
interface FileUploadFieldProps {
    label: string;
    name: string;
    onFileChange?: (file: File | null) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ label, name, onFileChange }) => {
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            if (onFileChange) onFileChange(file);
        } else {
            setFileName('');
             if (onFileChange) onFileChange(null);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-light mb-1">{label}</label>
            <input
                type="file"
                name={name}
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <div className="flex items-center gap-2">
                <button type="button" onClick={triggerFileSelect} className="flex items-center bg-primary-light text-white font-semibold py-2 px-3 rounded-md hover:opacity-80 text-sm">
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Choose File
                </button>
                {fileName && (
                    <div className="flex items-center text-sm text-green-400 overflow-hidden">
                        <CheckCircleIcon className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate" title={fileName}>{fileName}</span>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Director Type ---
interface Director {
    id: number;
    fullName: string;
    email: string;
    dob: string;
    idType: 'International Passport' | 'NIN';
}


interface KYCFormProps {
    suggestions: OnboardingSuggestions | null;
}

const KYCForm: React.FC<KYCFormProps> = ({ suggestions }) => {
    const [directors, setDirectors] = useState<Director[]>([
        { id: Date.now(), fullName: '', email: '', dob: '', idType: 'International Passport' }
    ]);

    const handleAddDirector = () => {
        setDirectors(prev => [...prev, { id: Date.now(), fullName: '', email: '', dob: '', idType: 'International Passport' }]);
    };

    const handleRemoveDirector = (id: number) => {
        setDirectors(prev => prev.filter(d => d.id !== id));
    };

    const handleDirectorChange = (id: number, field: keyof Omit<Director, 'id'>, value: string) => {
        setDirectors(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Comprehensive Compliance Information (KYB/AML)</h2>

            {suggestions && (
                 <div className="bg-primary p-4 rounded-lg border border-accent/30 space-y-3 mb-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-accent flex items-center"><LightbulbIcon className="mr-2"/> AI Onboarding Tool</h3>
                    <p className="text-sm text-gray-light">Based on your business description, our AI has prepared the following compliance overview to guide you.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
                        <div>
                            <p className="font-semibold text-gray-400">Identified Business Category:</p>
                            <p className="text-white">{suggestions.businessCategory}</p>
                        </div>
                         <div>
                            <p className="font-semibold text-gray-400">Estimated KYB Risk Level:</p>
                            <p className={`font-bold ${suggestions.kybRiskLevel === 'High' ? 'text-red-400' : suggestions.kybRiskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{suggestions.kybRiskLevel}</p>
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-400 text-sm">Key Compliance Considerations:</p>
                        <ul className="list-disc list-inside text-gray-light mt-1 text-sm space-y-1">
                            {suggestions.complianceNotes.map((note, i) => <li key={i}>{note}</li>)}
                        </ul>
                    </div>
                </div>
            )}
            
            <p className="text-sm text-gray-light -mt-2">To comply with international financial regulations, please provide the following details and documents about your business.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-light">Country of Incorporation</label>
                    <input name="incorporationCountry" className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-light">Company Registration Number</label>
                    <input name="registrationNumber" className="mt-1 w-full bg-primary p-2 rounded border border-primary-light" />
                </div>
            </div>

            <fieldset className="border border-primary-light rounded p-4">
                <legend className="text-lg font-semibold px-2 text-white">Directors & Key Persons</legend>
                <div className="space-y-6">
                    {directors.map((director, index) => (
                        <div key={director.id} className="p-4 bg-primary rounded-lg relative">
                             {directors.length > 1 && (
                                <button type="button" onClick={() => handleRemoveDirector(director.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300 font-bold text-xl">&times;</button>
                            )}
                            <div className="space-y-4">
                                <input value={director.fullName} onChange={(e) => handleDirectorChange(director.id, 'fullName', e.target.value)} placeholder={`Director ${index + 1} Full Name`} className="w-full bg-primary-light p-2 rounded border border-primary" />
                                <input value={director.email} onChange={(e) => handleDirectorChange(director.id, 'email', e.target.value)} type="email" placeholder="Email Address" className="w-full bg-primary-light p-2 rounded border border-primary" />
                                <input value={director.dob} onChange={(e) => handleDirectorChange(director.id, 'dob', e.target.value)} type="date" placeholder="Date of Birth" className="w-full bg-primary-light p-2 rounded border border-primary" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FileUploadField label="ID Document" name={`director_id_${director.id}`} />
                                    <select value={director.idType} onChange={(e) => handleDirectorChange(director.id, 'idType', e.target.value as Director['idType'])} className="w-full self-end bg-primary-light p-2 rounded border border-primary">
                                        <option>International Passport</option>
                                        <option>NIN</option>
                                    </select>
                                </div>
                                 <FileUploadField label="Personal Proof of Address" name={`director_address_proof_${director.id}`} />
                            </div>
                        </div>
                    ))}
                </div>
                 <button type="button" onClick={handleAddDirector} className="mt-4 text-sm text-accent font-semibold hover:underline">+ Add Another Director</button>
            </fieldset>

             <fieldset className="border border-primary-light rounded p-4">
                <legend className="text-lg font-semibold px-2 text-white">Company & Compliance Documents</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-2">
                    <FileUploadField label="Proof of Address of Company's Offices" name="company_address_proof" />
                    <FileUploadField label="Company Certificate of Incorporation" name="company_certificate" />
                    <FileUploadField label="Company's Memorandum of Article" name="company_memorandum" />
                    <FileUploadField label="Organization Chart" name="org_chart" />
                    <FileUploadField label="AML Policy Document" name="aml_policy" />
                    <FileUploadField label="Sanction Policies and Procedures" name="sanction_policy" />
                    <FileUploadField label="Transactions Policies and Procedures" name="transaction_policy" />
                    <FileUploadField label="Customers Onboarding Policies and Procedures" name="onboarding_policy" />
                </div>
            </fieldset>

            <fieldset className="border border-primary-light rounded p-4">
                <legend className="text-lg font-semibold px-2 text-white">Ultimate Beneficial Owners (UBOs)</legend>
                <p className="text-xs text-gray-light mb-2 mt-1">List all individuals who own or control 25% or more of the company.</p>
                <textarea name="ubos" rows={3} placeholder="Full Name, Nationality, % Ownership" className="w-full bg-primary p-2 rounded border border-primary-light"></textarea>
            </fieldset>

            <div>
                <label className="block text-sm font-medium text-gray-light">Primary Source of Funds</label>
                <select name="sourceOfFunds" className="mt-1 w-full bg-primary p-2 rounded border border-primary-light">
                    <option>Business Operations / Sales Revenue</option>
                    <option>Investor Funding</option>
                    <option>Personal Savings</option>
                    <option>Other</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-light">Expected Monthly Transaction Volume (USD)</label>
                <select name="expectedVolume" className="mt-1 w-full bg-primary p-2 rounded border border-primary-light">
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
