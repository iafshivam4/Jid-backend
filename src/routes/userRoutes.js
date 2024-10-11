// src/routes/userRoutes.js

const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware=require('../middleware/authMiddleware');
const { uploadDocument } = require('../controllers/documentController');

const router = express.Router();

router.post('/register', (req, res) => UserController.registerUser(req, res));

router.post('/loginUser', (req, res) => UserController.loginUser(req, res));
router.post('/upload',authMiddleware, uploadDocument);
router.post('/loginAdmin', (req, res) => UserController.loginAdmin(req, res));
router.get('/getUserList',authMiddleware, (req, res) => UserController.getUserList(req, res));

router.get('/userDoc/:user_id',authMiddleware, (req, res) => UserController.userDoc(req, res));


router.get('/getSumbitDocFOrUser',authMiddleware, (req, res) => UserController.getSumbitDocFOrUser(req, res));
router.delete('/users/:id', (req, res) => UserController.deleteUser(req, res));
router.post('/verifyOtp/:id', (req, res) => UserController.verifyOtp(req, res));
router.post('/SubmitDocument/:doc_id',authMiddleware, (req, res) => UserController.SubmitDocument(req, res));
router.post('/AcceptRejectDoc/:doc_id',authMiddleware, (req, res) => UserController.AcceptRejectDoc(req, res));

router.post('/uploadOffer/:user_id',authMiddleware, (req, res) => UserController.uploadOffer(req, res));

router.post('/isViewed/:user_id',authMiddleware, (req, res) => UserController.isViewed(req, res));

router.get('/getOfferLetter/:user_id',authMiddleware, (req, res) => UserController.getOfferLetter(req, res));

router.post('/AcceptRejectOffer/:user_id',authMiddleware, (req, res) => UserController.AcceptRejectOffer(req, res));

router.post('/sendWelcomeEmail/:user_id', (req, res) => UserController.sendWelcomeEmail(req, res));




module.exports = router;
