import { useState, useEffect } from 'react';
import { PartCategory, MechPart, PartPosition } from '../models/MechPart';
import { MechPartService } from '../services/MechPartService';

interface UsePartPositionsProps {
    mechParts: MechPart[];
    selectedParts: Record<PartCategory, number>;
    getCurrentPart: (category: PartCategory) => MechPart | undefined;
}

export const usePartPositions = ({ mechParts, selectedParts, getCurrentPart }: UsePartPositionsProps) => {
    const [partPositions, setPartPositions] = useState<Record<PartCategory, PartPosition>>({
        [PartCategory.Head]: { x: 0, y: 0 },
        [PartCategory.Arms]: { x: 0, y: 0 },
        [PartCategory.Legs]: { x: 0, y: 0 },
        [PartCategory.Chassis]: { x: 0, y: 0 },
    });

    useEffect(() => {
        const loadSavedPositions = async () => {
            try {
                const savedPositions = await MechPartService.loadPartPositions();
                setPartPositions(prev => {
                    const newPositions = { ...prev };
                    Object.values(PartCategory).forEach(category => {
                        const currentPart = getCurrentPart(category);
                        if (currentPart) {
                            // If we have a saved position for this part, use it, otherwise keep the default
                            newPositions[category] = savedPositions[currentPart.id] || { x: 0, y: 0 };
                        }
                    });
                    return newPositions;
                });
            } catch (error) {
                console.error('Failed to load part positions:', error);
            }
        };

        if (mechParts.length > 0) {
            loadSavedPositions();
        }
    }, [selectedParts, mechParts, getCurrentPart]);

    return { partPositions, setPartPositions };
};