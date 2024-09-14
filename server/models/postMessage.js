import mongoose from "mongoose";
//model in which data will be store in the moongose database
const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes : {
        type: [String],
        default : []

    },
    comments:{
        type: [String],
        default: []
    },
    createdAt:{
        type: Date,
        default : new Date()
    }


})
// exporting of schema as a model
const PostMessage = mongoose.model('PostMessage',postSchema)
export default PostMessage;