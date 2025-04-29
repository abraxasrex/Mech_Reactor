import { MechPart } from "../models/MechPart";

export class MechPartService {
    static async loadMechParts(): Promise<MechPart[]> {
        const response = await fetch("/data/mechParts.json");
        if (!response.ok) {
            throw new Error("Failed to load mech parts data.");
        }
        const data = await response.json();
     //   console.log("Loaded Mech Parts Data:", data); // Log the JSON data
        return data;
    }
}
