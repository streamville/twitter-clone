// >>>>> Handling traffic to the server <<<<<
const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middleware')
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require("./config/db");
const session = require('express-session');

const server = app.listen(port, () => console.log('Server listening on port ' + port));
 
connectDB();

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "iphone is superior",
  resave: true,
  saveUninitialized: false 
}))

// >>>>> Routes <<<<<
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');

app.use('/login', loginRoute);
app.use('/register', registerRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {

  var payload = {
    pageTitle: "Twitter Clone | Welcome",
    userLoggedIn: req.session.user
  }
  res.status(200).render("home", payload);
})