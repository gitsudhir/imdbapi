const pgp = require('pg-promise')(/* options */)
const express = require('express')
const { Client } = require('pg')
require('dotenv').config()
const cors = require('cors');
const helmet = require("helmet");
const morgan = require('morgan');
const Joi = require('joi').extend(require('@joi/date'));
const validator = require('express-joi-validation').createValidator({})


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
var allowlist = ['http://localhost:3000', 'https://*.netlify.app', 'https://main--tangerine-lokum-157c70.netlify.app']
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
app.use(express.json());

const db = pgp(config);

app.get('/', (req, res) => {
	res.send('Hello World by sudhir kumar!')
})

const bodySchema = Joi.object({
	name: Joi.string().alphanum().required(),
	details: Joi.string().required(),
	releaseDate: Joi.date().raw().required(),
	imageUrl: Joi.string().required(),
	genre: Joi.string().alphanum().required()
});

app.post('/api/create', validator.body(bodySchema), (req, res) => {
	const query = `SELECT id,title FROM movie_genre WHERE title = '${req.body.genre}';`
	db.one(query)
		.then((genreData) => {
			let {
				name,
				details,
				releaseDate,
				imageUrl,
			} = req.body;

			const query = `INSERT INTO  movie (name,details,release_date,image_url)values('${name}','${details}','${releaseDate}','${imageUrl}') RETURNING id;`
			db.one(query)
				.then((movieData) => {

					const query = `INSERT INTO  movie_genre_map (movie_id,genre_id)values('${movieData.id}','${genreData.id}');`
					db.any(query)
						.then((movie_genre_map) => {
							res.status(200).json({ status: "ok" })
						})
						.catch((error) => {
							console.log('ERROR:', error)
							res.status(500).send('Something broke!')
						})
				})
				.catch((error) => {
					console.log('ERROR:', error)
					res.status(500).send('Something broke!')
				})
		})
		.catch((error) => {
			console.log('ERROR:', error)
			res.status(500).send('Something broke!')
		})
	// res.send("imok");


});
app.get('/api/movie/list', (req, res) => {
	const query = `SELECT movie.id, movie.name,movie_genre.title as genre FROM movie,movie_genre_map,movie_genre WHERE movie.id = movie_genre_map.movie_id AND movie_genre.id = movie_genre_map.genre_id;`
	db.any(query)
		.then((data) => {
			res.json(data)
		})
		.catch((error) => {
			console.log('ERROR:', error)
			res.status(500).send('Something broke!')
		})


});
const paramsSchema = Joi.object({
	id: Joi.number().required()
});

app.get('/api/movie/:id', validator.params(paramsSchema), (req, res) => {
	const query = `SELECT movie.id, movie.name,movie_genre.title as genre ,movie.details,movie.release_date as releaseDate FROM movie,movie_genre_map,movie_genre WHERE movie.id = movie_genre_map.movie_id AND movie_genre.id = movie_genre_map.genre_id AND  movie.id = ${req.params.id};`
	db.any(query)
		.then((data) => {
			res.json(data)
		})
		.catch((error) => {
			console.log('ERROR:', error)
			res.status(500).send('Something broke!')
		})


});

const querySchema = Joi.object({
	title: Joi.string().alphanum().required()
});

app.get('/api/genres', validator.query(querySchema), (req, res) => {
	const query = `SELECT id,title FROM movie_genre WHERE title = '${req.query.title}';`
	db.one(query)
		.then((data) => {
			res.json((data));
		})
		.catch((error) => {
			console.log('ERROR:', error)
			res.status(500).send('Something broke!')
		})

})

app.get('/api/reviews/:id', validator.params(paramsSchema), (req, res) => {
	const query = `select review from movie_reviews where movie_id = ${req.params.id};`
	db.any(query)
		.then((data) => {
			res.json((data));
		})
		.catch((error) => {
			console.log('ERROR:', error)
			res.status(500).send('Something broke!')
		})

})
const reviewSchema = Joi.object({
	review: Joi.string().required()
});
app.post('/api/reviews/:id', validator.params(paramsSchema), validator.body(reviewSchema), (req, res) => {
	const query = `INSERT INTO  movie_reviews( movie_id,review)values (${req.params.id},'${req.body.review}');`
	db.any(query)
		.then((data) => {
			res.status(200).json((data));
		})
		.catch((error) => {
			console.log('ERROR:', error)
			res.status(500).send('Something broke!')
		})

})
const upvoteSchema = Joi.object({
	id: Joi.number().required()
});
const upvoteBody = Joi.object({
	upvote: Joi.number().required()
});
app.post('/api/upvote/:id', validator.params(upvoteSchema), validator.body(upvoteBody), (req, res) => {
	// should check the id in available or not in db
	const query = `UPDATE movie SET upvote = ${req.body.upvote} WHERE id = ${req.params.id};`
	db.any(query)
		.then((data) => {
			res.status(200).json({ status: "ok" })

		})
		.catch((error) => {
			console.log('ERROR:', error)
			res.status(500).send('Something broke!')
		})

})
const downvoteBody = Joi.object({
	downvote: Joi.number().required()
});
app.post('/api/downvote/:id', validator.params(upvoteSchema), validator.body(downvoteBody), (req, res) => {
	// should check the id in available or not in db
	const query = `UPDATE movie SET downvote = ${req.body.downvote} WHERE id = ${req.params.id};`
	db.any(query)
		.then((data) => {
			res.status(200).json({ status: "ok" })

		})
		.catch((error) => {
			console.log('ERROR:', error)
			res.status(500).send('Something broke!')
		})

})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})