import {Request, Response} from "express";

const express = require("express");

const app = express();
const port = 3000;

app.get('/request', (req: Request, res: Response) => res.send('Hello World!'));

app.use(express.static('../client/dist'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));