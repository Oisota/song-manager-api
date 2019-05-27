drop table if exists song;
create table if not exists song (
	id integer primary key autoincrement,
	name text not null,
	artist text,
	album text,
	genre text,
	length_ integer,
	user_id integer not null,
	constraint uc_song_user unique (name, user_id),
	foreign key (user_id) references user(id)
);

drop table if exists user;
create table if not exists user (
	id integer primary key autoincrement,
	auth0_id text not null
);