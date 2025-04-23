import React from 'react';

interface PartSelectorButtonsProps {
    onPrevious: () => void;
    onNext: () => void;
    className?: string;
}

const PartSelectorButtons: React.FC<PartSelectorButtonsProps> = ({ onPrevious, onNext, className = '' }) => {
    const buttonClass = "bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded";
    
    return (
        <>
            <button
                onClick={onPrevious}
                className={`${buttonClass} ${className}`}
                aria-label="Previous part"
            >
                ←
            </button>
            <button
                onClick={onNext}
                className={`${buttonClass} ${className}`}
                aria-label="Next part"
            >
                →
            </button>
        </>
    );
};

export default PartSelectorButtons;