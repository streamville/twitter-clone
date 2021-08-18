const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: {
    type: String,
    trim: true 
  },
  postedBy: { 
    // types from MongoDB:
    type: Schema.Types.ObjectId,
    ref: "User",
    pin: Boolean,
    likes: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }]
  }
}, { timestamps: true });

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;