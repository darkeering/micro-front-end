const express = require("express");

const app = express();

const port = 7000;

app.get("/api", (req, res) => {
  res.json("7000 response");
});

app.listen(port, () => {
  console.log("port is in " + port);
});
