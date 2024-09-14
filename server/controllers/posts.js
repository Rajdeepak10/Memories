import mongoose from "mongoose"
import PostMessage from "../models/postMessage.js"



// controllers controlling different type of functioning of different routes

// getposts controller
export const getPosts = async (req,res)=>{
    const page=req.query.page
    try {
        const LIMIT = 8
        const startIndex = (Number(page)-1)*LIMIT 
        // getting the starting index of every page
        const total = await PostMessage.countDocuments({}) // counting total posts



        const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex)

        res.status(200).json({
            data: posts,
            currentPage: Number(page),
            numberOfPages : Math.ceil(total/LIMIT)
        })
        
    } catch (error) {

        res.status(404).json({message: error.message})
    }
}
// query->means /posts?page=1-> page=1
// params-> /posts/:id-> id=123

// get posts by search 
export const getPostsBySearch=async (req,res)=>{
    const {searchQuery,tags}=req.query
    try {
        const title = new RegExp(searchQuery,'i')
        const tagArray = tags.split(",")
        

        // it means i stands for ignore case test,Test,TEST don't matters
        //$or operator is logical or operator sllow us to specify multiple conditions
        //title: title checks if title field in document matches the value stores in title variable
        // tags:{$in: tags} check if tags field in document contains at least one tag that is found in the array stored in tags variable


        const posts = await PostMessage.find({
            $or:[
                {title:title},
                {tags: {$in: tagArray}}
            ]
        })
        
        res.json({data: posts})
        
    } catch (error) {
        res.status(404).json({message: error.message})
        
    }

}
export const getPost = async(req,res)=>{
    const {id}= req.params 
    try {
        const post = await PostMessage.findById(id)
        res.status(200).json(post)
        
    } catch (error) {
        res.status(404).json({message: error.message})
        
    }
}

// create post controller
export const createPost = async (req,res)=>{
    const post= req.body
    //creating a new post according to given model
    const newPost = new PostMessage({...post,creator: req.userId,createdAt: new Date().toISOString()})
    try {
       await newPost.save()
       res.status(201).json(newPost)
        
    } catch (error) {
        res.status(409).json({message: error.message})
        
    }

}

// update controlller
export const updatePost = async(req,res)=>{
    // renaming id as _id
    const {id: _id} = req.params;
    const post = req.body
    if (!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("No post with that id")
    }
    // findbyidandupdate is method of mongoose model
    //post with _id
    const post1 = {...post,_id}
    const updatedVersion =await PostMessage.findByIdAndUpdate(_id,post1,{new:true})
    // new: true is set as to return the updated version of the post
    res.json(updatedVersion)



}
export const deletePost=async(req,res)=>{
    const {id}=req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).send("No post with that id")
        }
        await PostMessage.findByIdAndRemove(id);
        res.json({message: "post deleted successfully"})
        
    } catch (error) {
        console.log(error)
        
    }
}
export const likePost= async(req,res)=>{
    const {id}=req.params
    // in this way if we populate middleware then we go into next controller like in this case like controller
    if(!req.userId) return res.json({ message: 'Unauthenticated'})


    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send("No post with that id")
    }
    const post = await PostMessage.findById(id);


    const index = post.likes.findIndex((id)=> id===String(req.userId));

    if (index=== -1){
        // like a post
        post.likes.push(req.userId);
    }
    else{
        // dislike a post
        post.likes=post.likes.filter((id)=> id !== String(req.userId))

    }

    const updatePost = await PostMessage.findByIdAndUpdate(id,post,{new: true})
    res.json(updatePost)


}
export const commentPost = async(req,res)=>{
    const {id}=req.params
    const {value}=req.body
    const post = await PostMessage.findById(id)
    post.comments.push(value)
    const updatedPost = await PostMessage.findByIdAndUpdate(id,post,{new:true})
    res.json(updatedPost)

}