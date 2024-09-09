import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    commenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "postModel",
    },
    postModel: {
      type: String,
      required: true,
      enum: ["Review", "List"],
    },
    replyToUsername: String, //username at time of comment creation.
    replyToUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
