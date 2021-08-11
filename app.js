const express = require('express');
const app = express();
const port = 3000;

const server = app.listen(port, () => console.log('Server listening on port ' + port));

app.set("view engine", "pug");
app.set("views", "views");

app.get("/", (req, res, next) => {

  var payload = {
    pageTitle: "Best Twitter Clone Ever | Welcome"
  }
  res.status(200).render("home", payload);
})