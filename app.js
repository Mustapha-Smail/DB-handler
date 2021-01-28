require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.DB_HOST, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const clientSchema = {
  lName: String,
  fName: String,
  bDay: String,
  email: String,
  numTel: String
}

const Client = mongoose.model("Client", clientSchema);

app.get('/', (req, res) => {
  Client.find({}, (err, foundClients) => {
    if(err){
      console.log(err);
    }else{
      if(foundClients){
        foundClients.sort((a, b) => a.lName.localeCompare(b.lName));
        foundClients.sort((a, b) => a.fName.localeCompare(b.fName));
        res.render('home', {clientsList: foundClients});
      }else{
        res.render('home', {clientsList: []});
      }
    }
  })

})

app.post('/', (req, res) => {
  const wantedName = _.capitalize(req.body.wantedClientName);
  Client.find({lName: { "$regex": "^"+wantedName } }, (err, foundClients) => {
    if(err){
      console.log(err);
    }else{
      if(foundClients){
        foundClients.sort((a, b) => a.lName.localeCompare(b.lName));
        foundClients.sort((a, b) => a.fName.localeCompare(b.fName));
        res.render('home', {clientsList: foundClients});
      }else{
        res.render('home', {clientsList: []});
      }
    }
  })
})

app.get('/add', (req, res) => {
  res.render('add_client');
})

app.post('/add', (req, res) => {
  const clientFName = _.capitalize(req.body.fName);
  const clientLName = _.capitalize(req.body.lName);
  const clientBDay = req.body.birthDay;
  const clientEmail = req.body.email;
  const clientNumTel = req.body.numTel;

  const client = new Client({
    lName: clientLName ,
    fName: clientFName ,
    bDay: clientBDay,
    email: clientEmail ,
    numTel: clientNumTel
  })
  client.save();
  res.redirect('/');
})

app.post('/delete', (req, res) => {
  const deleteClient = req.body.deleteClient;
  Client.findByIdAndRemove(deleteClient, (err) => {
    if(err){
      console.log(err);
    }else{
      console.log("Successfully deleted the document.");
      res.redirect('/');
    }
  });
})

app.post('/edit', (req, res) => {
  const clientId = req.body.editClientId;
  Client.findOne({_id: clientId}, (err, foundClient) => {
    if(err){
      console.log(err);
    }else{
      res.render('edit_client', {clientEdit: foundClient});
    }
  });
})

app.post('/changeClient', (req, res) => {
  const clientToEdit = {
    id: req.body.clientId,
    bday: req.body.birthDay,
    email: req.body.email,
    tel: req.body.numTel
  }
  Client.findByIdAndUpdate(clientToEdit.id,
    {$set: {
      bDay: clientToEdit.bday,
      email: clientToEdit.email,
      numTel: clientToEdit.tel}}, (err)=>{
        if(err){
          console.log(err);
        }else{
          res.redirect('/');
        }
      })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
  console.log("Server has started successfully");
});
