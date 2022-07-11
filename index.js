const pgp = require('pg-promise')(/* options */)
const express = require('express')
const { Client } = require('pg')
require('dotenv').config()
const cors = require('cors');
const helmet = require("helmet");
const morgan = require('morgan');



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
var allowlist = ['http://localhost:3000', 'https://*.netlify.app','https://main--tangerine-lokum-157c70.netlify.app']
var corsOptionsDelegate = function (req, callback) {
	var corsOptions;
	if (allowlist.indexOf(req.header('Origin')) !== -1) {
		corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
	} else {
		corsOptions = { origin: false } // disable CORS for this request
	}
	callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate));
app.use(helmet());
app.use(morgan('combined'));

app.get('/', (req, res) => {
	res.send('Hello World by sudhir kumar!')
})
app.get('/api', (req, res) => {

	const db = pgp(config);


	db.any('SELECT * FROM information_schema.tables;')
		.then((data) => {
			// console.log('DATA:', data)
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