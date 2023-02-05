const router = require('express').Router();

const { getFriends, messageUploadDB, messageGet, ImageMessageSend, messageSeen, deliveredMessage} = require('../controller/messengerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/get-friends', authMiddleware, getFriends);
router.post('/send-message', authMiddleware, messageUploadDB);
router.post('/image-message-send', authMiddleware, ImageMessageSend);
router.get('/get-message/:id', authMiddleware, messageGet);

router.post('/seen-message', authMiddleware, messageSeen);
router.post('/delivered-message', authMiddleware, deliveredMessage);


module.exports = router;