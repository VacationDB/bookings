CREATE TABLE housedata (
  id int, 
  housename varchar(250),
  price int,
  cleaningFee int,
  serviceFee int,
  minStay int,
  maxGuests int
 );

COPY housedata (id, housename, price, cleaningFee, serviceFee, minStay, maxGuests) 
  FROM '/Users/dianey/myProjects/VacationDB/bookings/server/database/data/houseData.csv' delimiter ',' CSV HEADER;

CREATE TABLE reservations (
   id int,
   checkin date,
   duration int
);

COPY reservations (id, checkin, duration) 
  FROM '/Users/dianey/myProjects/VacationDB/bookings/server/database/data/reservationsData.csv' delimiter ',' CSV HEADER;

UPDATE reservations SET duration=5 WHERE id=1000000;
