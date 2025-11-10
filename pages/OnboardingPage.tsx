import React, { useState, useCallback, useEffect, useRef } from 'react';
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
    const steps = ["Account Info", "Verification", "Business Details", "Compliance", "Submit"];
    return (
        <nav className="flex items-center justify-center mb-8" aria-label="Progress">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex items-center">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep > index ? 'bg-accent text-primary' : currentStep === index ? 'bg-accent text-primary' : 'bg-gray-300 dark:bg-primary-light text-gray-600 dark:text-gray-300'}`}>
                            {currentStep > index ? <CheckCircleIcon className="w-5 h-5" /> : index + 1}
                        </span>
                        <span className={`ml-2 sm:ml-3 font-medium hidden sm:inline ${currentStep >= index ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{step}</span>
                    </div>
                    {index < steps.length - 1 && <div className="w-4 sm:w-8 mx-1 sm:mx-2 h-0.5 bg-gray-300 dark:bg-primary-light" />}
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
        const defaultData = {
            fullName: '',
            email: '',
            phoneNumber: '',
            password: '',
            emailCode: '',
            phoneCode: '',
            companyName: '',
            businessDescription: '',
            suggestions: null as OnboardingSuggestions | null,
        };
        return savedData ? { ...defaultData, ...JSON.parse(savedData) } : defaultData;
    });
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const emailCheckTimeout = useRef<number | null>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('onboardingStep', JSON.stringify(step));
    }, [step]);

    useEffect(() => {
        localStorage.setItem('onboardingData', JSON.stringify(formData));
    }, [formData]);
    
    const checkEmailExistence = useCallback((email: string) => {
        setIsCheckingEmail(true);
        setErrors(prev => ({ ...prev, email: '' }));
        // Simulate API call
        setTimeout(() => {
            if (email === 'taken@example.com') {
                setErrors(prev => ({ ...prev, email: 'This email address is already in use.' }));
            }
            setIsCheckingEmail(false);
        }, 1000);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        if (name === 'email') {
            if (emailCheckTimeout.current) {
                clearTimeout(emailCheckTimeout.current);
            }
            if (/\S+@\S+\.\S+/.test(value)) {
                emailCheckTimeout.current = window.setTimeout(() => {
                    checkEmailExistence(value);
                }, 500);
            }
        }
    };

    const fetchSuggestions = useCallback(async () => {
        if (formData.businessDescription.length > 50) {
            setIsLoadingAI(true);
            try {
                const result = await getOnboardingSuggestions(formData.businessDescription);
                setFormData(prev => ({ ...prev, suggestions: result }));
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
            if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required.';
            if (!formData.password) newErrors.password = 'Password is required.';
            else {
                const passwordErrors = [];
                if (formData.password.length < 8) passwordErrors.push("at least 8 characters");
                if (!/[A-Z]/.test(formData.password)) passwordErrors.push("an uppercase letter");
                if (!/[a-z]/.test(formData.password)) passwordErrors.push("a lowercase letter");
                if (!/[0-9]/.test(formData.password)) passwordErrors.push("a number");
                if (!/[^A-Za-z0-9]/.test(formData.password)) passwordErrors.push("a special character");
                if (passwordErrors.length > 0) {
                    newErrors.password = `Password must contain ${passwordErrors.join(', ')}.`;
                }
            }
        } else if (step === 1) { // Verification step
            if (!formData.emailCode || formData.emailCode.length < 6) newErrors.emailCode = 'Enter the 6-digit code sent to your email.';
            if (!formData.phoneCode || formData.phoneCode.length < 6) newErrors.phoneCode = 'Enter the 6-digit code sent to your phone.';
        } else if (step === 2) { // Business Details
            if (!formData.companyName) newErrors.companyName = 'Company name is required.';
            if (!formData.businessDescription) newErrors.businessDescription = 'Business description is required.';
        }
        setErrors(prev => ({...prev, ...newErrors}));
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-primary p-4">
             <div className="text-center mb-8">
                <Logo className="text-4xl sm:text-5xl" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">Join the Future of Global Payments</p>
            </div>

            <div className="w-full max-w-2xl">
                <StepIndicator currentStep={step} />
                <Card>
                    {step === 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Create Your Account</h2>
                            <div className="space-y-4">
                                <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className={`w-full bg-gray-100 dark:bg-primary p-2 rounded border ${errors.fullName ? 'border-accent' : 'border-gray-300 dark:border-primary-light'}`} />
                                {errors.fullName && <p className="text-accent text-xs mt-1">{errors.fullName}</p>}
                                
                                <div className="relative">
                                    <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className={`w-full bg-gray-100 dark:bg-primary p-2 rounded border ${errors.email ? 'border-accent' : 'border-gray-300 dark:border-primary-light'}`} />
                                    {isCheckingEmail && <Spinner className="absolute right-3 top-2.5" />}
                                    {errors.email && <p className="text-accent text-xs mt-1">{errors.email}</p>}
                                </div>

                                <input name="phoneNumber" type="tel" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} className={`w-full bg-gray-100 dark:bg-primary p-2 rounded border ${errors.phoneNumber ? 'border-accent' : 'border-gray-300 dark:border-primary-light'}`} />
                                {errors.phoneNumber && <p className="text-accent text-xs mt-1">{errors.phoneNumber}</p>}
                                
                                <div>
                                    <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className={`w-full bg-gray-100 dark:bg-primary p-2 rounded border ${errors.password ? 'border-accent' : 'border-gray-300 dark:border-primary-light'}`} />
                                    <PasswordStrengthIndicator password={formData.password} />
                                    {errors.password && <p className="text-accent text-xs mt-1">{errors.password}</p>}
                                </div>
                            </div>
                            <button onClick={nextStep} className="mt-6 w-full bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center">
                                Next <ArrowRightIcon className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-bold mb-2">Verify Your Identity</h2>
                            <p className="text-sm text-gray-400 mb-4">We've sent verification codes to your email and phone number.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Verification Code</label>
                                    <input name="emailCode" placeholder="Enter 6-digit code" maxLength={6} value={formData.emailCode} onChange={handleInputChange} className={`w-full bg-gray-100 dark:bg-primary p-2 rounded border ${errors.emailCode ? 'border-accent' : 'border-gray-300 dark:border-primary-light'}`} />
                                    {errors.emailCode && <p className="text-accent text-xs mt-1">{errors.emailCode}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Verification Code</label>
                                    <input name="phoneCode" placeholder="Enter 6-digit code" maxLength={6} value={formData.phoneCode} onChange={handleInputChange} className={`w-full bg-gray-100 dark:bg-primary p-2 rounded border ${errors.phoneCode ? 'border-accent' : 'border-gray-300 dark:border-primary-light'}`} />
                                    {errors.phoneCode && <p className="text-accent text-xs mt-1">{errors.phoneCode}</p>}
                                </div>
                            </div>
                            <div className="flex justify-between mt-6">
                                <button onClick={prevStep} className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-500">Back</button>
                                <button onClick={nextStep} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center">
                                    Verify & Continue <ArrowRightIcon className="ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                         <div>
                            <h2 className="text-xl font-bold mb-4">Tell Us About Your Business</h2>
                            <div className="space-y-4">
                                <div>
                                    <input name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleInputChange} className={`w-full bg-gray-100 dark:bg-primary p-2 rounded border ${errors.companyName ? 'border-accent' : 'border-primary-light'}`} />
                                    {errors.companyName && <p className="text-accent text-xs mt-1">{errors.companyName}</p>}
                                </div>
                                <div>
                                    <textarea name="businessDescription" placeholder="Describe your business activities..." value={formData.businessDescription} onChange={handleInputChange} onBlur={fetchSuggestions} rows={4} className={`w-full bg-gray-100 dark:bg-primary p-2 rounded border ${errors.businessDescription ? 'border-accent' : 'border-primary-light'}`} />
                                    {errors.businessDescription && <p className="text-accent text-xs mt-1">{errors.businessDescription}</p>}
                                </div>
                                
                                {isLoadingAI && <div className="flex items-center text-gray-500 dark:text-gray-300"><Spinner className="mr-2" /> AI is analyzing your business...</div>}

                                {formData.suggestions && (
                                    <div className="bg-primary p-4 rounded-lg border border-accent/30 space-y-3 animate-fade-in">
                                        <h3 className="text-lg font-semibold text-accent flex items-center"><LightbulbIcon className="mr-2"/> AI-Powered Insights</h3>
                                        <p><strong>Category:</strong> {formData.suggestions.businessCategory}</p>
                                        <p><strong>KYB Risk Level:</strong> <span className={formData.suggestions.kybRiskLevel === 'High' ? 'text-red-500' : formData.suggestions.kybRiskLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'}>{formData.suggestions.kybRiskLevel}</span></p>
                                        <div>
                                            <strong>Compliance Notes:</strong>
                                            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mt-1">
                                                {formData.suggestions.complianceNotes.map((note, i) => <li key={i}>{note}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between mt-6">
                                <button onClick={prevStep} className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-500">Back</button>
                                <button onClick={nextStep} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center">
                                    Next <ArrowRightIcon className="ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                         <div>
                            <KYCForm suggestions={formData.suggestions} />
                            <div className="flex justify-between mt-6">
                                <button onClick={prevStep} className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-500">Back</button>
                                <button onClick={nextStep} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90 flex items-center justify-center">
                                    Next <ArrowRightIcon className="ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 4 && (
                         <div className="text-center">
                            <h2 className="text-xl font-bold mb-4">Final Document Submission</h2>
                            <p className="text-gray-400 mb-4">Please upload any final required documents. In a real application, this would involve a KYC/KYB provider integration.</p>
                            <div className="p-4 border-2 border-dashed border-primary-light rounded-lg text-gray-500 mb-6">
                                [KYC/KYB Document Upload Component Here]
                            </div>
                             <div className="flex justify-between mt-6">
                                <button onClick={prevStep} className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-500">Back</button>
                                <button onClick={handleSubmit} className="bg-accent text-primary font-bold py-2 px-4 rounded hover:opacity-90">Complete Sign-Up</button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default OnboardingPage;
