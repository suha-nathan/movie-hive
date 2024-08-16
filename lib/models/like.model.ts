import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  madeBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  madeOn: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "madeOnModel",
  },
  madeOnModel: {
    type: String,
    required: true,
    enum: ["Movie", "Review", "List"],
  },
});

const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);

export default Like;
