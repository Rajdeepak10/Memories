import express from "express";
import {getPostsBySearch,getPosts,createPost,updatePost,deletePost,likePost,getPost,commentPost} from '../controllers/posts.js'
import auth from "../middlewares/auth.js";

const router = express.Router();
// adding middleware

//router for different type of routes
router.get('/',getPosts)
router.get('/search',getPostsBySearch)
router.get('/:id',getPost)

router.post('/',auth,createPost)
router.patch('/:id',auth,updatePost)
router.delete('/:id',auth,deletePost)
router.patch('/:id/likePost',auth,likePost)
router.post('/:id/commentPost',auth,commentPost)

export default router