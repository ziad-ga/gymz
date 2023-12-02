// simple express app
import "dotenv/config";
import express from "express";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();

app.use(cors("*"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

function signJWT({ username, email }) {
  return jwt.sign({ username, email }, process.env.jwtsecret, {
    expiresIn: "2h",
  });
}

const verifyToken = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.params.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtsecret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

app.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;
    console.log(req.body);

    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    db.all(`select * from users where email=?`, [email], (err, row) => {
      let user = row[0];
      if (user && compareSync(password + process.env.secret, user.password)) {
        // Create token
        const token = signJWT({ username: user.username, email });

        // save user token
        user.token = token;
        delete user.password;
        delete user.id;
        // user
        return res.status(201).json(user);
      } else res.status(400).send("Invalid Credentials");
    });
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.post("/register", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    let { username, email, password } = req.body;

    // Validate user input
    if (!(username && email && password)) {
      res.status(400).send("All input is required");
    }

    //Encrypt user password
    let hash = hashSync(password + process.env.secret, 10);

    // Create user in our database
    db.all(
      `insert into users (username, email, password) values (?, ?, ?)`,
      [username, email, hash],
      (err, row) => {
        if (err) throw err;
        const token = signJWT({ username, email });
        res.status(201).json({token, username, email});
      }
    );
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// some protected resource
app.get("/", verifyToken, (req, res, next) => {
  // get user info from db
  db.all(`select * from users where email=?`, [req.user.email], (err, row) => {
    let { username, email } = row[0];
    res.json(JSON.stringify({ username, email }));
  });
});

const db = new sqlite3.Database("./data.db", (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
});
