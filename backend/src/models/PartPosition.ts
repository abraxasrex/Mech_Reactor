import mongoose from 'mongoose';

const PartPositionSchema = new mongoose.Schema({
    partId: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Chassis', 'Head', 'Arms', 'Legs']
    },
    position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    }
}, { timestamps: true });

export const PartPosition = mongoose.model('PartPosition', PartPositionSchema);