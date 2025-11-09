import React from 'react';

interface PasswordStrengthIndicatorProps {
    password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
    const getStrength = () => {
        let score = 0;
        if (!password) return 0;
        // Award points for different criteria
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getStrength();
    const label = ['', 'Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'][strength] || '';
    
    const colorClasses = [
        { bar: 'bg-gray-400 dark:bg-gray-500', text: 'text-gray-500 dark:text-gray-400' }, // 0
        { bar: 'bg-yellow-500', text: 'text-yellow-500' },   // 1
        { bar: 'bg-yellow-500', text: 'text-yellow-500' },   // 2
        { bar: 'bg-accent', text: 'text-accent' },// 3
        { bar: 'bg-green-500', text: 'text-green-500' }, // 4
        { bar: 'bg-green-500', text: 'text-green-500' }  // 5
    ][strength] || { bar: 'bg-gray-500', text: 'text-gray-400' };
    
    const width = `${(strength / 5) * 100}%`;

    if (!password) {
        return null;
    }

    return (
        <div className="w-full mt-2">
            <div className="w-full bg-gray-200 dark:bg-primary rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${colorClasses.bar} transition-all duration-300`} style={{ width }}></div>
            </div>
            <p className={`text-xs text-right mt-1 ${colorClasses.text}`}>{label}</p>
        </div>
    );
};

export default PasswordStrengthIndicator;