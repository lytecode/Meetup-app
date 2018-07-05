const express =  require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
	
	res
		.status(200)
		.json({message: 'Welcome to meetup app'});
});

app.get('*', (req, res) => {
	
	res
	   .status(404)
	   .send('Page NotFound');
});

app.listen(PORT, () =>{
	console.log(`app started on port ${PORT}`);
});
