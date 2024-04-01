const express = require("express");
const app = express();
const bodyParser = require("body-parser"); 
const cookieParser = require("cookie-parser"); 
const session = require("express-session");
const flash = require('express-flash')
const passport = require("passport");
require("./config/auth.js")(passport);
require("./config/passport")(passport);

app.use(flash());
// app.use(bodyParser())
app.use(
  session({
    secret:"secret",
    resave: false,  
    saveUninitialized: false, 
    cookie: { maxAge: 30 * 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const cors = require("cors"); 

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, 
}));

const auth_routes = require("./routes/auth.routes");
app.use(auth_routes);

const profile_routes = require("./routes/profile.routes");
app.use(profile_routes);

const art_routes = require("./routes/artwork.routes");
app.use(art_routes);

const follow_routes = require("./routes/follow.routes");
app.use(follow_routes);

const like_routes = require("./routes/like.routes");
app.use(like_routes);

const cmnt_routes = require("./routes/comment.routes");
app.use(cmnt_routes);

const ensureAuthenticated = require("./middlewares/auth.middleware");
app.get("/welcome", ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/views/homePage.html");
});


const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((error) => {
    console.log(error);
  });


module.exports = app;
