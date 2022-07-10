const pgp = require('pg-promise')(/* options */)
const express = require('express')
const { Client } = require('pg')
require('dotenv').config()
const cors = require('cors');
let ssl = true;
if (process.env.NODE_ENV === 'development') {
	ssl = { rejectUnauthorized: false };
}
const config = {
	connectionString: process.env.DATABASE_URL,
	max: 30,
	ssl: ssl
};
const app = express()
const port = process.env.PORT || 3001
app.use(cors());
app.get('/', (req, res) => {
	res.send('Hello World by sudhir kumar!')
})
app.get('/api', (req, res) => {

	const db = pgp(config);

	
	db.any('SELECT * FROM information_schema.tables;')
		.then((data) => {
			console.log('DATA:', data)
			res.json((data));
		})
		.catch((error) => {
			console.log('ERROR:', error)
			res.status(500).send('Something broke!')
		})

})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})