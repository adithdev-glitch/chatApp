import express from 'express';
import { isAuth } from '../middleware/Auth.js';
import { clearChat, getChatImages, getMessages, getUsersForSidebar, sendMessage } from '../controllers/Message.js';

const router = express.Router();

router.get('/users',isAuth, getUsersForSidebar);
router.get('/:id', isAuth, getMessages);
router.post('/send/:id', isAuth, sendMessage);  
router.get("/images/:userId", isAuth, getChatImages); 
router.delete("/clear/:id", isAuth, clearChat);

export default router;