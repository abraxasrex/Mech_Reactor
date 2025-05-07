import { MechPart, PartCategory } from "../models/MechPart";

interface PartPosition {
    x: number;
    y: number;
}

export class MechPartService {
    private static API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

    static async loadMechParts(): Promise<MechPart[]> {
        const response = await fetch("/data/mechParts.json");
        if (!response.ok) {
            throw new Error("Failed to load mech parts data.");
        }
        const data = await response.json();
        console.log("Loaded Mech Parts Data from server:", data); 
        // Log the JSON data
        //   console.log("Loaded Mech Parts Data:", data); // Log the JSON data
        return data;
    }

    static async savePartPosition(partId: string, category: PartCategory, position: PartPosition): Promise<void> {
       
        console.log("Saving Part Position:", { partId, category, position }); // Log the parameters being sent
        const response = await fetch(`${this.API_BASE}/part-positions/${partId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category, position }),
        });

        if (!response.ok) {
            throw new Error('Failed to save part position');
        } else {
            const data = await response.json();
            console.log("Part Position Saved:", data); // Log the response from the server
        }
    }

    static async loadPartPositions(): Promise<Record<string, PartPosition>> {
        const response = await fetch(`${this.API_BASE}/part-positions`);
        if (!response.ok) {
            throw new Error('Failed to load part positions');
        }
        const positions = await response.json();
        return positions.reduce((acc: Record<string, PartPosition>, pos: any) => {
            acc[pos.partId] = pos.position;
            return acc;
        }, {});
    }
}
