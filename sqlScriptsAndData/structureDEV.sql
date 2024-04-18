/*Delete database if exists*/
/*DROP DATABASE IF EXISTS pr3_db;*/

/*Create database*/
/*CREATE DATABASE pr3_db;*/

/*Delete tables if exist*/
DROP TABLE IF EXISTS pr3_db.users;
DROP TABLE IF EXISTS pr3_db.users_categories;
DROP TABLE IF EXISTS pr3_db.vehicles;

/*Create table users_categories*/
CREATE TABLE pr3_db.users_categories (
    id INT NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

/*Create table users*/
CREATE TABLE pr3_db.users (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_name  VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    id_users_categories INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_users_categories) REFERENCES users_categories(id)
);

/*Create table vehicles*/
CREATE TABLE pr3_db.vehicles (
    id INT NOT NULL AUTO_INCREMENT,
    vehicle_code VARCHAR(50) NOT NULL,
    last_location_latitude VARCHAR(100) NOT NULL,
    last_location_longitude VARCHAR(100) NOT NULL,
    last_actualization BIGINT NOT NULL,
    PRIMARY KEY (id)
);

/*Create table detected_events*/
CREATE TABLE pr3_db.detected_events (
    id INT NOT NULL AUTO_INCREMENT,
    vehicle_code VARCHAR(50) NOT NULL,
    event VARCHAR(100) NOT NULL,
    start_date_time bigint NOT NULL,
    start_location_latitude VARCHAR(100) NOT NULL,
    start_location_longitude VARCHAR(100) NOT NULL,
    event_duration_seconds INT NOT NULL,
    score DECIMAL(4,3) NOT NULL,
    video VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

/*Create table detected_events_steps*/
CREATE TABLE pr3_db.detected_events_steps (
    id INT NOT NULL AUTO_INCREMENT,
    id_detected_events INT NOT NULL,
    step VARCHAR(100) NOT NULL,
    start_location_latitude VARCHAR(100) NOT NULL,
    start_location_longitude VARCHAR(100) NOT NULL,
    start_date_time BIGINT NOT NULL,
    speed decimal(5,2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_detected_events) REFERENCES detected_events(id)
);

