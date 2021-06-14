'use strict';

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/digimon',
    { useNewUrlParser: true, useUnifiedTopology: true });


const digimonSchema = new mongoose.Schema({
    name: String,
    img: String,
    level: String

});


const digimonModel = new mongoose.model('digimon', digimonSchema);



app.get('/', testHandler);
app.get('/digimons', getDigimonsHandler);
app.post('/addToFav', addToFavHandler);
app.get('/getFav', getFavHandler);
app.delete('/delete/:id', deleteHandler);
app.put('/update/:index', updateHandler);




function getDigimonsHandler(req, res) {
    const url = 'https://digimon-api.vercel.app/api/digimon';
    axios.get(url).then(result => {
        const digimonArray = result.data.map(item => {
            return new Digimon(item);
        })
        res.send(digimonArray);
    })
};

function addToFavHandler(req, res) {
    const { name, img, level } = req.body;
    const digimon = new digimonModel({
        name: name,
        img: img,
        level: level
    })
    // console.log(digimon);
    digimon.save();
};

function getFavHandler(req, res) {
    digimonModel.find({}, (err, Data) => {
        res.send(Data);
    })

};

function deleteHandler(req, res) {
    const id = req.params.id;
    digimonModel.remove({ _id: id }, (err, favData) => {
        digimonModel.find({}, (err, Data) => {
            res.send(Data);
        })
    })
};

function updateHandler(req, res) {
    digimonModel.find({}, (err, Data) => {
        Data.map((item,idx)=>{
            if(idx == req.params.index){
                item.name = req.body.name
                item.img = req.body.img
                item.level = req.body.level
                item.save();
            }
        })
        res.send(Data);
    })
};

class Digimon {
    constructor(item) {
        this.name = item.name
        this.img = item.img
        this.level = item.level
    }
}


function testHandler(req, res) {
    res.send('Hello From Backend')
};



app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

