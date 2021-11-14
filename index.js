const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5010;
const cors = require("cors");
const bearerToken = require("express-bearer-token");
const morgan = require("morgan");
const { mySqlDb } = require("./src/connections");
morgan.token("date", function (req, res) {
  return new Date();
});

app.get("/", (req, res) => {
  res.send("<h1>welcome<h1>");
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :date")
);

app.use(express.json());

app.use(
  cors({
    exposedHeaders: ["x-token-access", "x-token-refresh", "x-total-count"],
  })
);

app.use(bearerToken());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.listen(PORT, () => console.log(`API JALAN DI PORT ${PORT}`));
