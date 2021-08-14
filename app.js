// >>>>> Handling traffic to the server <<<<<
const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middleware')
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const connectDB = require("./config/db");

const server = app.listen(port, () => console.log('Server listening on port ' + port));
 
// >>>>> Connect to database <<<<<
connectDB();

app.set("view engine", "pug");
app.set("views", "views");

// >>>>> setting up body-parser <<<<<
app.use(bodyParser.urlencoded({ extended: false }));
// >>>>> Serving public files <<<<<
app.use(express.static(path.join(__dirname, "public")));

// >>>>> Routes <<<<<
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');

app.use('/login', loginRoute);
app.use('/register', registerRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {

  var payload = {
    pageTitle: "Best Twitter Clone Ever | Welcome"
  }
  res.status(200).render("home", payload);
})