import React from 'react';
import { MechPart, PartCategory } from '../models/MechPart';

interface PartCategoryUIProps {
    category: PartCategory;
    currentPart: MechPart | undefined;
    onPrevious: () => void;
    onNext: () => void;
}

const PartCategoryUI: React.FC<PartCategoryUIProps> = ({
    category,
    currentPart,
    onPrevious,
    onNext
}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between space-x-4">
                <button
                    onClick={onPrevious}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                    aria-label="Previous part"
                >
                    ←
                </button>
                
                <div className="flex-1">
                    <h2 className="text-xl font-bold">{category}</h2>
                    {currentPart ? (
                        <div>
                            <h3 className="text-lg font-semibold">{currentPart.readableName}</h3>
                            <p className="text-gray-600 text-sm">{currentPart.description}</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">No part selected</p>
                    )}
                </div>

                <button
                    onClick={onNext}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                    aria-label="Next part"
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default PartCategoryUI;