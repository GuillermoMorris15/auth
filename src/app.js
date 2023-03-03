const express = require('express')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const app = express();
dotenv.config()
const users = [
  { email: "admin@example.com", name: "admin", rol: "admin" },
  { email: "user@example.com", name: "user", rol: "user" },
];
app.use(express.json());
const validationJWT = (req, res, next) => {
  const Authorization = req.header("Authorization");
  try {
    const mostrar = jwt.verify(Authorization, process.env.SECRET_KEY)
    if (mostrar.rol === "admin") {
      req.headers = {...req.headers, rol: "admin"};
    }
    if (mostrar.rol === "user") {
      req.headers = { ...req.headers, rol: "user" };
    }
    next();
  } catch (e) {
    return res.json({e});
  }
};
app.get("/", function (req, res) {
  res.send("Bienvenido a la api de ADA Cars");
});
app.get("/premium-clients", validationJWT, (req, res) => {
  if (req.headers("rol") === "admin") {
    res.send("premium-clients list")
  } else {
    res.json({ error: "Access not allowed" });

  }
});
app.get("/medium-clients", validationJWT, (req, res) => {
  if (req.headers("rol") === "admin" || req.headers("rol") === "user") {
    res.send("medium-clients list")
  } else {  
    res.json({ error: "Access not allowed" });
  }
});
app.post("/auth", function (req, res) {
  const { email } = req.body;
  const validUsers = users.find((datos) => datos.email === email);
  if (!validUsers)
    return res.status(401).send({ error: "Invalid user name or password" });
  const token = jwt.sign(validUsers, process.env.SECRET_KEY, {
    algorithm: "HS256",
  });
  res.send({ token });
});
module.exports = app;