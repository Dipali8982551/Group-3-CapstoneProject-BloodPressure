require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const initDb = require("./config/initDb");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const bPDataRouter = require("./routes/bPData");
const errorMiddleware = require("./routes/errorMiddleware");
const chatbotRoutes = require("./routes/chatbot");


const PORT = process.env.PORT || 3001;

// log all requests to the console in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Setting up express to use json and set it to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", chatbotRoutes); // Register the chatbot route


initDb();

// Serve up static assets in production (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(authRouter, usersRouter, bPDataRouter, errorMiddleware);

// Send all other requests to react app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
