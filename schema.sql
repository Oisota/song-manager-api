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

drop table if exists setlist;
create table setlist (
	id integer primary key autoincrement,
	name text not null,
	constraint uc_song unique (name)
);

drop table if exists songlist;
create table songlist (
	setlist_id integer not null,
	song_id integer not null,
	primary key (setlist_id, song_id),
	foreign key (setlist_id) references setlist(id),
	foreign key (song_id) references song(id)
);
