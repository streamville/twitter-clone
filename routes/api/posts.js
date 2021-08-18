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

module.exports = router;