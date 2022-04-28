'use strict';

const http = require('http')
const express = require('express');
const cors = require("cors");



const app = express();
const server = http.createServer(app)
const port=process.env.PORT||5000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true }));


const router1=require('./router/post')
const router2=require('./router/get')


app.use("/",router1);
app.use("/",router2);

server.listen(port ,()=>console.log(`server started.... ${port}`))