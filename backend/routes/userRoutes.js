import express from 'express';
import {
    getPeople, 
    createPerson,
    loginPerson,
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: List all people
router.get('/people', getPeople);


router.post('/signup', createPerson);
router.post('/login', loginPerson);

export default router;
