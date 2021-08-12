// >>>>>> Handling traffic to the server <<<<<<
const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middleware')
const path = require('path');

const server = app.listen(port, () => console.log('Server listening on port ' + port));

app.set("view engine", "pug");
app.set("views", "views");

// >>>>> Serving public files <<<<<
app.use(express.static(path.join(__dirname, "public")));

// >>>>> Routes <<<<<
const loginRoute = require('./routes/loginRoutes');
app.use('/login', loginRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {

  var payload = {
    pageTitle: "Best Twitter Clone Ever | Welcome"
  }
  res.status(200).render("home", payload);
})