	CREATE TABLE movie (
		id INT,
		name TEXT,
		details TEXT,
		Upvote INT,
		downvote INT,
		release_date DATE,
		PRIMARY KEY (id)
	  );
	  
	  CREATE TABLE movie_genre (
		movie_id INT,
		id INT,
		value TEXT,
		PRIMARY KEY (id),
		FOREIGN KEY (movie_id) REFERENCES movie(id)
	  );
	  
	  CREATE TABLE movie_reviews (
		movie_id INT,
		id INT,
		value TEXT,
		PRIMARY KEY (id),
		FOREIGN KEY (movie_id) REFERENCES movie(id)
	  );