import express from 'express';
import { sendContactMessage } from '../controllers/contact.controller.js';

const router = express.Router();

// Contact form route
router.post('/', sendContactMessage);

export default router;

