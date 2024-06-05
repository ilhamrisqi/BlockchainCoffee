import express from "express";
import * as tools from './tools.mjs';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Coffee = await tools.constructSmartContract(); // Assuming tools.mjs has the function to interact with the smart contract
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static('src'));
app.use(cookieParser());

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response) {
    response.render('pages/registration');
});

app.post('/createBatch', async (request, response) => {
    const { origin, destination } = request.body;
    try {
        let tx = await Coffee.createCoffeeBatch(origin, destination);
        console.log(tx);
        response.send(`<p id='batchCreated'>Successfully Created Coffee Batch: Origin - ${origin}, Destination - ${destination}</p>`);
    } catch (err) {
        console.log(err);
        response.status(500).send("Error creating coffee batch");
    }
});

