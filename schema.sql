drop table if exists song;
create table song (
	id integer primary key autoincrement,
	name text not null,
	artist text,
	album text,
	genre text,
	minutes integer,
	seconds integer,
	constraint uc_song unique (name)
);
