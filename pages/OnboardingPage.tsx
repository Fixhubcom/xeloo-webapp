
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingSuggestions } from '../types';
import { getOnboardingSuggestions } from '../services/geminiService';
import Logo from '../components/common/Logo';
import Spinner from '../components/common/Spinner';
import Card from '../components/common/Card';
import { ArrowRightIcon, CheckCircleIcon, LightbulbIcon } from '../components/icons/Icons';

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ["Account Info", "Business Details", "Verification"];
    return (
        <nav className="flex items-center justify-center mb-8" aria-label="Progress">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex items-center">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep > index ? 'bg-accent text-primary' : currentStep === index ? 'bg-yellow-400 text-primary' : 'bg-gray-medium text-gray-light'}`}>
                            {currentStep > index ? <CheckCircleIcon className="w-5 h-5" /> : index + 1}
                        </span>
                        <span className={`ml-3 font-medium ${currentStep >= index ? 'text-white' : 'text-gray-light'}`}>{step}</span>
                    </div>
                    {index < steps.length - 1 && <div className="w-8 mx-2 h-0.5 bg-gray-medium" />}
                </React.Fragment>
            ))}
        </nav>
    );
};

const OnboardingPage: React.FC = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        companyName: '',
        businessDescription: '',
    });
    const [suggestions, setSuggestions] = useState<OnboardingSuggestions | null>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const fetchSuggestions = useCallback(async () => {
        if (formData.businessDescription.length > 50) {
            setIsLoadingAI(true);
            try {
                const result = await getOnboardingSuggestions(formData.businessDescription);
                setSuggestions(result);
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
            } finally {
                setIsLoadingAI(false);
            }
        }
    }, [formData.businessDescription]);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Onboarding complete:", formData);
        // In a real app, you would register the user and then log them in.
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-primary p-4">
             <div className="text-center mb-8">
                <Logo className="text-5xl" />
                <p className="mt-2 text-gray-light">Join the Future of Global Payments</p>
            </div>

            <div className="w-full max-w-2xl">
                <StepIndicator currentStep={step} />
                <Card>
                    {step === 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Create Your Account</h2>
                            <div className="space-y-4">
                                <input name="fullName" placeholder="Full Name" onChange={handleInputChange} className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                                <input name="email" type="email" placeholder="Email Address" onChange={handleInputChange} className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                                <input name="password" type="password" placeholder="Password" onChange={handleInputChange} className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                            </div>
                            <button onClick={nextStep} className="mt-6 w-full bg-accent text-primary font-bold py-2 px-4 rounded hover:bg-yellow-400 flex items-center justify-center">
                                Next <ArrowRightIcon className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    )}
                    {step === 1 && (
                         <div>
                            <h2 className="text-xl font-bold mb-4">Tell Us About Your Business</h2>
                            <div className="space-y-4">
                                <input name="companyName" placeholder="Company Name" onChange={handleInputChange} className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                                <textarea name="businessDescription" placeholder="Describe your business activities..." onChange={handleInputChange} onBlur={fetchSuggestions} rows={4} className="w-full bg-gray-dark p-2 rounded border border-gray-medium" />
                                
                                {isLoadingAI && <div className="flex items-center text-gray-light"><Spinner className="mr-2" /> AI is analyzing your business...</div>}

                                {suggestions && (
                                    <div className="bg-primary p-4 rounded-lg border border-accent/30 space-y-3 animate-fade-in">
                                        <h3 className="text-lg font-semibold text-accent flex items-center"><LightbulbIcon className="mr-2"/> AI-Powered Insights</h3>
                                        <p><strong>Category:</strong> {suggestions.businessCategory}</p>
                                        <p><strong>KYB Risk Level:</strong> <span className={suggestions.kybRiskLevel === 'High' ? 'text-red-400' : 'text-green-400'}>{suggestions.kybRiskLevel}</span></p>
                                        <div>
                                            <strong>Compliance Notes:</strong>
                                            <ul className="list-disc list-inside text-gray-light mt-1">
                                                {suggestions.complianceNotes.map((note, i) => <li key={i}>{note}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between mt-6">
                                <button onClick={prevStep} className="bg-gray-medium text-white font-bold py-2 px-4 rounded hover:bg-gray-500">Back</button>
                                <button onClick={nextStep} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:bg-yellow-400 flex items-center justify-center">
                                    Next <ArrowRightIcon className="ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                         <div className="text-center">
                            <h2 className="text-xl font-bold mb-4">Identity Verification</h2>
                            <p className="text-gray-light mb-4">To comply with regulations, we need to verify your identity. In a real application, this would involve a KYC/KYB provider integration.</p>
                            <div className="p-4 border-2 border-dashed border-gray-medium rounded-lg text-gray-light">
                                [KYC/KYB Upload Component Here]
                            </div>
                             <div className="flex justify-between mt-6">
                                <button onClick={prevStep} className="bg-gray-medium text-white font-bold py-2 px-4 rounded hover:bg-gray-500">Back</button>
                                <button onClick={handleSubmit} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600">Complete Sign-Up</button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default OnboardingPage;
