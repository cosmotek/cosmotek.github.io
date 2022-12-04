---
author: "Seth Moeckel"
title: "Full-text search for the database you already have"
date: 2022-11-07
description: "Exploring the basics of full-text search using PostgreSQL"
summary: "Exploring the basics of full-text search and result ranking using PostgreSQL"
tags: ["postgres", "sql", "search", "full-text"]
draft: true
# featured_image: /featured-placeholder.jpg
---

Good example: https://m.signalvnoise.com/?s=javascript

When writing a list of the highest-impact features in any given application, Full-text search it likely to be at the top.

Assuming you're already using PostgreSQL, complex full-text search can be added to your application with relative ease. 

Test Datasets:
* [Netflix Titles Dataset](https://github.com/cosmotek/postgres_search_demo/blob/1063bf4f9f10a04a6e1988b1ff5f4c04c432618b/netflix_titles.csv)
* [IMDB Videogames Dataset](https://github.com/cosmotek/postgres_search_demo/blob/1063bf4f9f10a04a6e1988b1ff5f4c04c432618b/imdb-videogames.csv)

Import script:
```sql
COPY persons(first_name, last_name, dob, email)
FROM 'C:\sampledb\persons.csv'
DELIMITER ','
CSV HEADER;
```

Table modifications:
```sql
-- Use these to convert string-formatted list columns in the import data to postgres arrays
alter table netflix_titles alter COLUMN "cast" type text[] using (string_to_array("cast", ','));
alter table netflix_titles alter COLUMN listed_in type text[] using (string_to_array(listed_in, ','));
alter table netflix_titles alter COLUMN country type text[] using (string_to_array(country, ','));
```

```sql
alter table netflix_titles add column search_document tsvector generated always as (make_search_document(
	title,
	description,
	"cast",
	listed_in,
	'{}'
	-- array_cat(country, array_cat(director::text[], array_cat("type"::text[], array_cat((release_year::text)::text[], rating::text[]))))
)) stored;

create index on netflix_titles using gin (search_document);
```

Search document creation function:
```sql
create or replace function make_search_document(
	title text,
	description text,
	related_people text[],
	related_subjects text[],
	general_tags text[]
) returns tsvector
	as $search_doc$
	declare
		search_doc tsvector;
	begin
		select
			setweight(to_tsvector('english', title), 'A') ||
			setweight(to_tsvector('english', coalesce(description, '')), 'D') ||
			setweight(to_tsvector('simple', array_to_string(related_people, ' ')), 'B') ||
			setweight(to_tsvector('english', array_to_string(related_subjects, ' ')), 'C') ||
			setweight(to_tsvector('simple', array_to_string(general_tags, ' ')), 'D')
		into search_doc;
		return search_doc;
	end;
	$search_doc$ language plpgsql immutable parallel safe;
```

Example query:
```sql
select * from netflix_titles
	where (to_tsquery('english', 'Angry') @@ search_document 
		or plainto_tsquery('simple', 'Angry') @@ search_document 
		or websearch_to_tsquery('simple', 'Angry') @@ search_document) 
	limit 300;
```