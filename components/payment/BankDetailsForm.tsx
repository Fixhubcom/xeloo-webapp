
import React from 'react';

interface BankDetailsFormProps {
    recipientName: string;
    setRecipientName: (value: string) => void;
    recipientEmail: string;
    setRecipientEmail: (value: string) => void;
    bankDetails: { accountNumber: string; bankName: string; routingNumber: string; iban: string; swiftCode: string; };
    setBankDetails: (value: React.SetStateAction<{ accountNumber: string; bankName: string; routingNumber: string; iban: string; swiftCode: string; }>) => void;
}

const BankDetailsForm: React.FC<BankDetailsFormProps> = ({
    recipientName, setRecipientName, recipientEmail, setRecipientEmail, bankDetails, setBankDetails
}) => (
    <div className="space-y-4 pt-2">
        <p className="text-xs text-gray-400 -mb-2">
            Recipient will receive funds directly in their bank account.
        </p>
        <input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Recipient's Full Name or Company" className="w-full bg-primary p-2 rounded border border-primary-light" required />
        <input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} placeholder="Recipient's Email (for notifications)" className="w-full bg-primary p-2 rounded border border-primary-light" required />
        <input value={bankDetails.bankName} onChange={e => setBankDetails(p => ({ ...p, bankName: e.target.value }))} placeholder="Bank Name" className="w-full bg-primary p-2 rounded border border-primary-light" required />
        <input value={bankDetails.accountNumber} onChange={e => setBankDetails(p => ({ ...p, accountNumber: e.target.value }))} placeholder="Account Number" className="w-full bg-primary p-2 rounded border border-primary-light" required />
        <input value={bankDetails.routingNumber} onChange={e => setBankDetails(p => ({ ...p, routingNumber: e.target.value }))} placeholder="Routing Number (if applicable)" className="w-full bg-primary p-2 rounded border border-primary-light" />
        <input value={bankDetails.iban} onChange={e => setBankDetails(p => ({ ...p, iban: e.target.value }))} placeholder="IBAN (if applicable)" className="w-full bg-primary p-2 rounded border border-primary-light" />
        <input value={bankDetails.swiftCode} onChange={e => setBankDetails(p => ({ ...p, swiftCode: e.target.value }))} placeholder="SWIFT/BIC Code (if applicable)" className="w-full bg-primary p-2 rounded border border-primary-light" />
    </div>
);

export default BankDetailsForm;
