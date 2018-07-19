const express =  require('express');
const ejs = require('ejs');
require('dotenv').config();
const router = require('./app/routes/route');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));
app.set('view engine', 'ejs');


app.use(router);


app.listen(PORT, () =>{
	console.log(`app started on port ${PORT}`);
});
