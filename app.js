import dotenv from "dotenv"; 
dotenv.config()
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import methodOverride from "method-override"
import connectDB from "./config/db.js"
import {default as clientsRoute}  from "./routes/clients.js"

connectDB()

const app = express();

// set ejs template
app.set('view engine', 'ejs');

// static folder 
app.use(express.static('public'));

// body parser 
app.use(bodyParser.urlencoded({
  extended: true
}));

// method override to use PUT and DELETE
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// ROUTES 
app.use('/', clientsRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
