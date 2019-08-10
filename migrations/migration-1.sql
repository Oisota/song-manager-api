drop table if exists song;
create table if not exists song (
	id integer primary key autoincrement,
	name text not null,
	artist text,
	album text,
	genre text,
	length_ integer,
	user_id integer not null,
	constraint uc_song unique (name)
	foreign key (user_id) references user(id)
);

drop table if exists user;
create table if not exists user (
	id integer primary key autoincrement,
	email text not null,
	hash text not null,
	verified integer not null default 0,
	role_id integer not null,
	foreign key (role_id) references role(id)
);

drop table if exists role;
create table role (
	id integer primary key autoincrement,
	name text not null
);

insert into role (name) values ('user');
insert into role (name) values ('admin');
