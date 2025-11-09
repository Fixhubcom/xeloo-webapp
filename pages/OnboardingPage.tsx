
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingSuggestions } from '../types';
import { getOnboardingSuggestions } from '../services/geminiService';
import Logo from '../components/common/Logo';
import Spinner from '../components/common/Spinner';
import Card from '../components/common/Card';
import { ArrowRightIcon, CheckCircleIcon, LightbulbIcon } from '../components/icons/Icons';
import PasswordStrengthIndicator from '../components/common/PasswordStrengthIndicator';
import KYCForm from './onboarding/KYCForm';

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ["Account Info", "Business Details", "Compliance", "Verification"];
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
    const [step, setStep] = useState(() => {
        const savedStep = localStorage.getItem('onboardingStep');
        return savedStep ? JSON.parse(savedStep) : 0;
    });
    
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('onboardingData');
        return savedData ? JSON.parse(savedData) : {
            fullName: '',
            email: '',
            password: '',
            companyName: '',
            businessDescription: '',
        };
    });
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [suggestions, setSuggestions] = useState<OnboardingSuggestions | null>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('onboardingStep', JSON.stringify(step));
    }, [step]);

    useEffect(() => {
        localStorage.setItem('onboardingData', JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
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

    const validateStep = () => {
        const newErrors: { [key: string]: string } = {};
        if (step === 0) {
            if (!formData.fullName) newErrors.fullName = 'Full name is required.';
            if (!formData.email) newErrors.email = 'Email is required.';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
            if (!formData.password) newErrors.password = 'Password is required.';
            else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long.';
        } else if (step === 1) {
            if (!formData.companyName) newErrors.companyName = 'Company name is required.';
            if (!formData.businessDescription) newErrors.businessDescription = 'Business description is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(s => s + 1);
        }
    };
    
    const prevStep = () => setStep(s => s - 1);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Onboarding complete:", formData);
        localStorage.removeItem('onboardingStep');
        localStorage.removeItem('onboardingData');
        navigate('/confirm-email');
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
                                <div>
                                    <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className={`w-full bg-gray-dark p-2 rounded border ${errors.fullName ? 'border-red-500' : 'border-gray-medium'}`} />
                                    {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                                </div>
                                <div>
                                    <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className={`w-full bg-gray-dark p-2 rounded border ${errors.email ? 'border-red-500' : 'border-gray-medium'}`} />
                                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className={`w-full bg-gray-dark p-2 rounded border ${errors.password ? 'border-red-500' : 'border-gray-medium'}`} />
                                    <PasswordStrengthIndicator password={formData.password} />
                                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                                </div>
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
                                <div>
                                    <input name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleInputChange} className={`w-full bg-gray-dark p-2 rounded border ${errors.companyName ? 'border-red-500' : 'border-gray-medium'}`} />
                                    {errors.companyName && <p className="text-red-400 text-xs mt-1">{errors.companyName}</p>}
                                </div>
                                <div>
                                    <textarea name="businessDescription" placeholder="Describe your business activities..." value={formData.businessDescription} onChange={handleInputChange} onBlur={fetchSuggestions} rows={4} className={`w-full bg-gray-dark p-2 rounded border ${errors.businessDescription ? 'border-red-500' : 'border-gray-medium'}`} />
                                    {errors.businessDescription && <p className="text-red-400 text-xs mt-1">{errors.businessDescription}</p>}
                                </div>
                                
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
                         <div>
                            <KYCForm />
                            <div className="flex justify-between mt-6">
                                <button onClick={prevStep} className="bg-gray-medium text-white font-bold py-2 px-4 rounded hover:bg-gray-500">Back</button>
                                <button onClick={nextStep} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:bg-yellow-400 flex items-center justify-center">
                                    Next <ArrowRightIcon className="ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                         <div className="text-center">
                            <h2 className="text-xl font-bold mb-4">Final Verification</h2>
                            <p className="text-gray-light mb-4">Please upload a government-issued ID and a proof of address. In a real application, this would involve a KYC/KYB provider integration.</p>
                            <div className="p-4 border-2 border-dashed border-gray-medium rounded-lg text-gray-light mb-6">
                                [KYC/KYB Document Upload Component Here]
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
