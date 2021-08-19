const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');

app.get(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
  Post.find()
  .populate("postedBy")
  .sort({"createdAt": -1})
  .then(result => res.status(200).send(result))
  .catch(error => {
    console.log(error);
    res.sendStatus(400);
  })
})

router.post('/', async (req, res, next) => {
  // if no content is found:
  if(!req.body.content){
    console.log("content param not send with request");
    return res.sendStatus(400);
  }

  var postData = {
    content: req.body.content,
    postedBy: req.session.user
  }

  // creating posts:
  Post.create(postData)
  .then(async newPost => {
    newPost = await User.populate(newPost, { path: "postedBy" })
    res.status(201).send(newPost);
  })
  .catch(error => {
    console.log(error);
    res.sendStatus(400);
  })
})

// LIKE button - PUT request by Ajax:
router.put('/:id/like', async (req, res, next) => {
  
  var postId = req.params.id;
  var userId = req.session.user._id;

  var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

  // $addToSet is from MongoDB.
  var option = isLiked ? "$pull" : "$addToSet";

  // Insert user like:
  await User.findByIdAndUpdate(userId, { [option]: { likes: postId } })

  // Insert post like


  res.status(200).send("YAHOO");
  })

module.exports = router;