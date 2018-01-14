create table if not exists song (
	id integer primary key autoincrement,
	name text not null,
	artist text,
	album text,
	genre text,
	minutes integer,
	seconds integer,
	constraint uc_song unique (name)
);

create table if not exists setlist (
	id integer primary key autoincrement,
	name text not null,
	constraint uc_song unique (name)
);

create table if not exists song_setlist (
	setlist_id integer not null,
	song_id integer not null,
	primary key (setlist_id, song_id),
	foreign key (setlist_id) references setlist(id),
	foreign key (song_id) references song(id)
);
