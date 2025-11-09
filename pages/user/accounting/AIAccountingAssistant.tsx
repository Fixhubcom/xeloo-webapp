import React, { useState, useRef } from 'react';
import Card from '../../../components/common/Card';
import Spinner from '../../../components/common/Spinner';
import { JournalEntry } from '../../../types';
import { processAccountingEntry } from '../../../services/geminiService';
import { SparklesIcon, UploadIcon, CheckCircleIcon } from '../../../components/icons/Icons';

interface AIAccountingAssistantProps {
    onAddEntry: (newEntries: Omit<JournalEntry, 'id'>[]) => void;
}

type AssistantStep = 'input' | 'loading' | 'confirm' | 'success';

const AIAccountingAssistant: React.FC<AIAccountingAssistantProps> = ({ onAddEntry }) => {
    const [step, setStep] = useState<AssistantStep>('input');
    const [inputText, setInputText] = useState('');
    const [uploadedFile, setUploadedFile] = useState<{ file: File, base64: string } | null>(null);
    const [extractedEntries, setExtractedEntries] = useState<Omit<JournalEntry, 'id'>[]>([]);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString().split(',')[1];
                if (base64String) {
                    setUploadedFile({ file, base64: base64String });
                    setInputText(prev => prev ? `${prev}\n[Attached: ${file.name}]` : `[Attached: ${file.name}]`);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText && !uploadedFile) return;

        setStep('loading');
        setError('');

        try {
            const imagePayload = uploadedFile ? { mimeType: uploadedFile.file.type, data: uploadedFile.base64 } : undefined;
            const result = await processAccountingEntry(inputText, imagePayload);
            if (result && result.length === 2) {
                setExtractedEntries(result);
                setStep('confirm');
            } else {
                throw new Error("AI did not return a valid double-entry pair.");
            }
        } catch (err) {
            setError("Sorry, the AI couldn't process this entry. Please try rephrasing or check the document quality.");
            setStep('input');
        }
    };

    const handleConfirm = () => {
        onAddEntry(extractedEntries);
        setStep('success');
    };
    
    const resetForm = () => {
        setInputText('');
        setUploadedFile(null);
        setExtractedEntries([]);
        setError('');
        setStep('input');
    }

    if (step === 'success') {
        return (
            <Card className="text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-400 mb-2">Entry Posted!</h2>
                <p className="text-gray-light mb-6">The journal entry has been successfully added to your books.</p>
                <button onClick={resetForm} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:bg-yellow-400">
                    Add Another Entry
                </button>
            </Card>
        );
    }

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-2">AI Accounting Assistant</h2>
            <p className="text-gray-light mb-6">Describe a transaction or upload a receipt, and let AI create the journal entry for you.</p>

            {step === 'input' && (
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="e.g., 'Paid $50 for a software subscription to Figma on July 25th' or 'Received payment of $1200 from Acme Inc.'"
                        rows={4}
                        className="w-full bg-primary p-3 rounded border border-primary-light focus:ring-accent focus:border-accent"
                    />
                     {uploadedFile && (
                        <div className="mt-4 p-2 bg-primary rounded-md flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={URL.createObjectURL(uploadedFile.file)} alt="Preview" className="w-12 h-12 rounded object-cover mr-3" />
                                <span className="text-sm text-gray-light">{uploadedFile.file.name}</span>
                            </div>
                            <button type="button" onClick={() => setUploadedFile(null)} className="text-red-400 hover:text-red-300 text-sm font-bold">Remove</button>
                        </div>
                    )}
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <div className="flex justify-between items-center mt-4">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center bg-primary-light text-white font-bold py-2 px-4 rounded hover:bg-opacity-80">
                            <UploadIcon className="w-5 h-5 mr-2" /> Upload Document
                        </button>
                        <button type="submit" disabled={!inputText && !uploadedFile} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90 flex items-center disabled:bg-gray-500">
                            <SparklesIcon className="w-5 h-5 mr-2" /> Process Entry
                        </button>
                    </div>
                     {error && <p className="text-yellow-400 text-center mt-4">{error}</p>}
                </form>
            )}

            {step === 'loading' && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Spinner className="w-8 h-8" />
                    <p className="mt-4 text-gray-light">AI is analyzing your entry...</p>
                </div>
            )}
            
            {step === 'confirm' && (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Please Confirm the Entry</h3>
                    <div className="bg-primary p-4 rounded-lg space-y-2">
                        {extractedEntries.map((entry, index) => (
                             <div key={index} className="grid grid-cols-4 gap-4 items-center">
                                <input defaultValue={entry.date} className="col-span-1 bg-primary-light p-2 rounded text-sm" />
                                <input defaultValue={entry.account} className="col-span-2 bg-primary-light p-2 rounded text-sm" />
                                <div className="col-span-1 grid grid-cols-2 gap-2">
                                     <input defaultValue={entry.debit > 0 ? entry.debit.toFixed(2) : ''} placeholder="Debit" className="bg-primary-light p-2 rounded text-sm text-right font-mono" />
                                     <input defaultValue={entry.credit > 0 ? entry.credit.toFixed(2) : ''} placeholder="Credit" className="bg-primary-light p-2 rounded text-sm text-right font-mono" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">You can edit the fields above if needed.</p>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button onClick={resetForm} className="bg-gray-700 text-white font-bold py-2 px-6 rounded hover:bg-gray-600">Cancel</button>
                        <button onClick={handleConfirm} className="bg-accent text-primary font-bold py-2 px-6 rounded hover:opacity-90">
                            Confirm & Post Entry
                        </button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default AIAccountingAssistant;
