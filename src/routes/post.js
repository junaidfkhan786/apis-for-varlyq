const express = require('express');
const router = express.Router();
const postsController = require('../controllers/post');
const { verifyAccessToken } = require('../helpers/jwt_helper');

router.get('/',verifyAccessToken, postsController.getAllPosts);
router.post('/create',verifyAccessToken, postsController.createPosts);

router.put('/edit/:id' ,verifyAccessToken,postsController.editPosts);
router.put('/addcomment/:id' ,verifyAccessToken,postsController.addCommentToPosts);
router.put('/addlike' ,verifyAccessToken,postsController.addLikesToComment);

router.delete('/delete/:id',verifyAccessToken,postsController.postdelById);

module.exports = router;