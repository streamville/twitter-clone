const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../schemas/UserSchema');
const bcrypt = require('bcrypt');


app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
  res.status(200).render("register");
})

// >>>>> start of function <<<<<
router.post('/', async (req, res, next) => {

  // validations of forms:
  var firstName = req.body.firstName.trim();
  var lastName = req.body.lastName.trim();
  var username = req.body.username.trim();
  var email = req.body.email.trim();
  var password = req.body.password;

  var payload = req.body;

  if(firstName && lastName && username && password && email){
    var user = await User.findOne({ 

      // $or is from MongoDB
      $or: [
        { username: username },
        { email: email },
      ]
    })
   .catch((error) => {
    console.log(error);
    payload.errorMessage = "Something went wrong o_O";
    res.status(200).render("register", payload);
   })

   // If no user is found:
   if(user == null){
    var data = req.body;

    // hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>
    data.password = await bcrypt.hash(password, 10)

    User.create(data)
    .then((user) => {
      // setting user's session:
      req.session.user = user;
      return res.redirect('/');
    })
   }
   else{
     // When same user is found:
    if(email == user.email){
      payload.errorMessage = "Email already in use o_O";
    }
    else{
      payload.errorMessage = "Username already in use o_O";
    }
    res.status(200).render("register", payload);
   }
  }
  else{
    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("register", payload);
  }
})

module.exports = router;