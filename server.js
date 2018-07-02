const express =  require('express');

const app = express();
const PORT = 5000;


app.get('/', (req, res) => {
	res.send('Homepage');
});


app.listen(PORT, () =>{
	console.log(`app started on port ${PORT}`);
});
