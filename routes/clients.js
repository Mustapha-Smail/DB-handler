import express from 'express'
import _ from "lodash";
const router = express.Router()

import Client from "../models/Client.js";


router.get('/', (req, res) => {
    Client.find({}, (err, foundClients) => {
        if (err) {
            console.log(err);
        } else {
            if (foundClients) {
                foundClients.sort((a, b) => a.lName.localeCompare(b.lName));
                foundClients.sort((a, b) => a.fName.localeCompare(b.fName));
                res.render('home', {
                    clientsList: foundClients
                });
            } else {
                res.render('home', {
                    clientsList: []
                });
            }
        }
    })
})

router.post('/', (req, res) => {
    const wantedName = _.capitalize(req.body.wantedClientName);
    Client.find({
        lName: {
            "$regex": "^" + wantedName
        }
    }, (err, foundClients) => {
        if (err) {
            console.log(err);
        } else {
            if (foundClients) {
                foundClients.sort((a, b) => a.lName.localeCompare(b.lName));
                foundClients.sort((a, b) => a.fName.localeCompare(b.fName));
                res.render('home', {
                    clientsList: foundClients
                });
            } else {
                res.render('home', {
                    clientsList: []
                });
            }
        }
    })
})

router.get('/add', (req, res) => {
    res.render('add_client');
})

router.post('/add', (req, res) => {

    const client = new Client({
        lName: _.capitalize(req.body.fName),
        fName: _.capitalize(req.body.lName),
        bDay: req.body.birthDay,
        email: req.body.email,
        numTel: req.body.numTel
    })
    client.save();
    res.redirect('/');
})

router.delete('/delete', (req, res) => {
    const deleteClient = req.body.deleteClient;
    Client.findByIdAndRemove(deleteClient, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully deleted the document.");
            res.redirect('/');
        }
    });
})

router.post('/edit', (req, res) => {
    const clientId = req.body.editClientId;
    Client.findOne({
        _id: clientId
    }, (err, foundClient) => {
        if (err) {
            console.log(err);
        } else {
            res.render('edit_client', {
                clientEdit: foundClient
            });
        }
    });
})

router.put('/changeClient', (req, res) => {

    Client.findByIdAndUpdate(req.body.clientId, {
        $set: {
            bDay: req.body.birthDay,
            email: req.body.email,
            numTel: req.body.numTel
        }
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })
})

export default router;