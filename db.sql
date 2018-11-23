DROP DATABASE IF EXISTS booking_platform;
CREATE DATABASE booking_platform;
USE booking_platform;




CREATE TABLE users (
                id INT AUTO_INCREMENT NOT NULL,
                user_type VARCHAR(20) NOT NULL,
                email VARCHAR(60) NOT NULL,
                password VARCHAR(128) NOT NULL,
                date_created DATE NOT NULL,
                PRIMARY KEY (id)
);


CREATE UNIQUE INDEX users_idx
 ON users
 ( email );

CREATE TABLE phone_list (
                phone_id INT AUTO_INCREMENT NOT NULL,
                id INT NOT NULL,
                phone VARCHAR(25) NOT NULL,
                PRIMARY KEY (phone_id)
);


CREATE TABLE logs (
                log_id INT AUTO_INCREMENT NOT NULL,
                id INT NOT NULL,
                activity_log VARCHAR(50) NOT NULL,
                PRIMARY KEY (log_id)
);

ALTER TABLE logs COMMENT 'This table will record a list of activities that user will do, such as subscribing, booking, deleting and etc. It records enum values';


CREATE TABLE service_provider (
                s_id INT AUTO_INCREMENT NOT NULL,
                company_full_name VARCHAR(40) NOT NULL,
                approved_status VARCHAR(20) NOT NULL,
                PRIMARY KEY (s_id)
);


CREATE TABLE booking_slots (
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                s_id INT NOT NULL,
                availability BOOLEAN DEFAULT True NOT NULL,
                PRIMARY KEY (timestamp, s_id)
);


CREATE TABLE location (
                s_id INT NOT NULL,
                eir_code VARCHAR(10) NOT NULL,
                second_line_address VARCHAR(30) NOT NULL,
                first_line_address VARCHAR(50) NOT NULL,
                city VARCHAR(20) DEFAULT 'Dublin' NOT NULL,
                PRIMARY KEY (s_id)
);

ALTER TABLE location COMMENT 'This table represents a sub class, so the relation is one to one';


CREATE TABLE customers (
                c_id INT AUTO_INCREMENT NOT NULL,
                first_name VARCHAR(25) NOT NULL,
                last_name VARCHAR(25) NOT NULL,
                PRIMARY KEY (c_id)
);


CREATE TABLE complaints (
                complaint_ID INT AUTO_INCREMENT NOT NULL,
                s_id INT NOT NULL,
                c_id INT NOT NULL,
                complaint VARCHAR(500) NOT NULL,
                PRIMARY KEY (complaint_ID)
);


CREATE TABLE booking (
                time_stamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                s_id INT NOT NULL,
                c_id INT NOT NULL,
                booking_status VARCHAR(15) NOT NULL,
                review VARCHAR(20),
                PRIMARY KEY (time_stamp, s_id, c_id)
);


ALTER TABLE customers ADD CONSTRAINT users_customers_fk
FOREIGN KEY (c_id)
REFERENCES users (id)
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE service_provider ADD CONSTRAINT users_service_provider_fk
FOREIGN KEY (s_id)
REFERENCES users (id)
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE logs ADD CONSTRAINT users_logs_fk
FOREIGN KEY (id)
REFERENCES users (id)
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE phone_list ADD CONSTRAINT users_phone_list_fk
FOREIGN KEY (id)
REFERENCES users (id)
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE location ADD CONSTRAINT service_provider_location_fk
FOREIGN KEY (s_id)
REFERENCES service_provider (s_id)
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE booking_slots ADD CONSTRAINT service_provider_booking_slots_fk
FOREIGN KEY (s_id)
REFERENCES service_provider (s_id)
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE complaints ADD CONSTRAINT service_provider_complaints_fk
FOREIGN KEY (s_id)
REFERENCES service_provider (s_id)
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE booking ADD CONSTRAINT booking_slots_booking_fk
FOREIGN KEY (time_stamp, s_id)
REFERENCES booking_slots (timestamp, s_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE booking ADD CONSTRAINT customers_booking_fk
FOREIGN KEY (c_id)
REFERENCES customers (c_id)
ON DELETE CASCADE
ON UPDATE NO ACTION;

ALTER TABLE complaints ADD CONSTRAINT customers_complaints_fk
FOREIGN KEY (c_id)
REFERENCES customers (c_id)
ON DELETE CASCADE
ON UPDATE NO ACTION;

/*INSERTING THE DEFAULT ADMIN SUPERUSER HARDCODED*/
INSERT INTO users (password, email, date_created, user_type) VALUES('21232F297A57A5A743894A0E4A801FC3', 'admin@admin.admin', '2018-11-15', 'ADMIN'); /*PASSWORD IS: 'admin' */

