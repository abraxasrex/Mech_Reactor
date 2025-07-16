import React, { useCallback, useState } from 'react';
import { MechPart, PartCategory } from '../models/MechPart';


enum HandleUINavState {
    Previous = 'Previous',
    Next = 'Next',
}

const getNextIndex = (category: PartCategory, prev: Record<PartCategory, number>, categoryParts: MechPart[])=> {
       return (prev[category] + 1) % categoryParts.length;
}

const getPreviousIndex = (category: PartCategory, prev: Record<PartCategory, number>, categoryParts: MechPart[])=> {
    return (prev[category] - 1 + categoryParts.length) % categoryParts.length;
}

const HelpHandleUINav =
    (
            setSelectedParts: React.Dispatch<React.SetStateAction<Record<PartCategory, number> | null >>,
            mechParts: MechPart[] | null,
            handleUINavState: HandleUINavState
    ) => {
        return (category: PartCategory) =>
            setSelectedParts(prev => {
            if (!prev || !mechParts) return null; // Handle the case where prev is null

            const categoryParts = HelpGetPartsByCategory(mechParts)(category);
            const newIndex = handleUINavState === HandleUINavState.Next
                ? getNextIndex(category, prev, categoryParts)
                : getPreviousIndex(category, prev, categoryParts);
            return { ...prev, [category]: newIndex };
        });
};


export const HelpGetPartsByCategory = (mechParts: MechPart[] ) => {
        return (category: PartCategory): MechPart[] => {
            return mechParts.filter(part => part.partCategory === category);
        };
};


export const HelpHandlePrevious = (
        setSelectedParts: React.Dispatch<React.SetStateAction<Record<PartCategory, number> | null >>,
        mechParts: MechPart[] | null
    ) => {
        return HelpHandleUINav(setSelectedParts, mechParts, HandleUINavState.Previous);
}

export const HelpHandleNext = (
        setSelectedParts: React.Dispatch<React.SetStateAction<Record<PartCategory, number> | null >>,
        mechParts: MechPart[] | null                                            
    ) => {
    return HelpHandleUINav(setSelectedParts, mechParts, HandleUINavState.Next);
}




// export const HelpHandlePrevious =
//     (
//             setSelectedParts: React.Dispatch<React.SetStateAction<Record<PartCategory, number> | null >>,
//             mechParts: MechPart[] | null
//     ) => {
//         return (category: PartCategory) =>
//             setSelectedParts(prev => {
//             if (!prev || !mechParts) return null; // Handle the case where prev is null

//             const categoryParts = HelpGetPartsByCategory(mechParts);
//             const newIndex = (prev[category] - 1 + categoryParts.length) % categoryParts.length;
//             return { ...prev, [category]: newIndex };
//         });
// };

// export const HelpHandleNext =
//     (
//             setSelectedParts: React.Dispatch<React.SetStateAction<Record<PartCategory, number> | null >>,
//             mechParts: MechPart[] | null
//     ) => {
//         return (category: PartCategory) =>
//             setSelectedParts(prev => {
//             if (!prev || !mechParts) return null; // Handle the case where prev is null

//             const categoryParts = HelpGetPartsByCategory(mechParts);
//             const newIndex = (prev[category] + 1) % categoryParts.length;
//             return { ...prev, [category]: newIndex };
//         });
// };


