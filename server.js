const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const profile = require('./routes/api/profile');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const port = process.env.PORT || 5000;
const passport = require('passport');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());

require('./config/passport')(passport);

const db = require("./config/keys").mongoURI;

mongoose
        .connect(db, {useNewUrlParser: true})
        .then(()=> {console.log("MongoDB connected!")})
        .catch(err=>{console.log(err)});

        
        
app.use("/api/profile", profile);
app.use("/api/users", users);
app.use("/api/posts", posts);





app.listen(port, ()=> console.log(`Server working on port ${port}`));