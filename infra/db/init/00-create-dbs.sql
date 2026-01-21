CREATE USER auth_user WITH PASSWORD 'auth_pass';
CREATE USER social_user WITH PASSWORD 'social_pass';
CREATE USER lists_user WITH PASSWORD 'lists_pass';
CREATE USER pins_user WITH PASSWORD 'pins_pass';
CREATE USER moderation_user WITH PASSWORD 'moderation_pass';

CREATE DATABASE auth_db OWNER auth_user;
CREATE DATABASE social_db OWNER social_user;
CREATE DATABASE lists_db OWNER lists_user;
CREATE DATABASE pins_db OWNER pins_user;
CREATE DATABASE moderation_db OWNER moderation_user;
