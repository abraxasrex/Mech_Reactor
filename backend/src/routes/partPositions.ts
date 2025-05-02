import express from 'express';
import { PartPosition } from '../models/PartPosition';

const router = express.Router();

// Get all part positions
router.get('/', async (req, res) => {
    try {
        const positions = await PartPosition.find();
        res.json(positions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching part positions: ', error });
    }
});

// Update or create part position
router.post('/:partId', async (req, res) => {
    try {
        const { partId } = req.params;
        const { category, position } = req.body;

        const updatedPosition = await PartPosition.findOneAndUpdate(
            { partId },
            { 
                partId,
                category,
                position
            },
            { new: true, upsert: true }
        );

        res.json(updatedPosition);
    } catch (error) {
        res.status(500).json({ message: 'Error updating part position' });
    }
});

export default router;