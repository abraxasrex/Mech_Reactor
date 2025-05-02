"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartPosition = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PartPositionSchema = new mongoose_1.default.Schema({
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
exports.PartPosition = mongoose_1.default.model('PartPosition', PartPositionSchema);
