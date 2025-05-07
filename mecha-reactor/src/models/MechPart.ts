export enum PartCategory {
    Chassis = "Chassis",
    Head = "Head",
    Arms = "Arms",
    Legs = "Legs"
}

export interface PartPosition {
    x: number;
    y: number;
}

export interface MechPart {
    id: string;
    readableName: string;
    description: string;
    imageSource?: string; // Optional for parts like Arms and Legs
    leftImageSource?: string; // For parts with distinct left and right images
    rightImageSource?: string; // For parts with distinct left and right images
    partCategory: PartCategory;
}
