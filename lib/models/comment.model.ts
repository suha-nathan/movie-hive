import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {type: String, required: true},
    commenter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    community:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    },
    parentId:{
        type: String
    },
    children:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
},{ timestamps: true})

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema)

export default Comment;