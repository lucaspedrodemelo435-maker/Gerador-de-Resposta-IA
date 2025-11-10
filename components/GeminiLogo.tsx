
import React from 'react';

interface GeminiLogoProps {
    className?: string;
}

export const GeminiLogo: React.FC<GeminiLogoProps> = ({ className }) => (
    <svg 
        width="100" 
        height="100" 
        viewBox="0 0 100 100" 
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <linearGradient id="geminiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#8b5cf6'}} />
                <stop offset="50%" style={{stopColor: '#ec4899'}} />
                <stop offset="100%" style={{stopColor: '#ef4444'}} />
            </linearGradient>
        </defs>
        <path 
            fill="url(#geminiGradient)" 
            d="M50,5.9C46.9,5.9,44,8.8,44,11.9v23.7c0,3.1,2.9,6,6,6s6-2.9,6-6V11.9C56,8.8,53.1,5.9,50,5.9z"
        />
        <path 
            fill="url(#geminiGradient)" 
            d="M78.5,21.5c-2.4-2.4-6.4-2.4-8.8,0L53.4,37.8c-2.4,2.4-2.4,6.4,0,8.8c2.4,2.4,6.4,2.4,8.8,0l16.2-16.2 C80.9,27.9,80.9,23.9,78.5,21.5z"
        />
        <path 
            fill="url(#geminiGradient)" 
            d="M21.5,21.5c-2.4,2.4-2.4,6.4,0,8.8l16.2,16.2c2.4,2.4,6.4,2.4,8.8,0c2.4-2.4,2.4-6.4,0-8.8L30.3,21.5 C27.9,19.1,23.9,19.1,21.5,21.5z"
        />
        <path 
            fill="url(#geminiGradient)" 
            opacity="0.6" 
            d="M50,94.1c3.1,0,6-2.9,6-6V58.3c0-3.1-2.9-6-6-6s-6,2.9-6,6v29.7C44,91.2,46.9,94.1,50,94.1z"
        />
    </svg>
);
