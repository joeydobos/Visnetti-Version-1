CREATE TABLE venues (
Venue_ID INT PRIMARY KEY,
Venue_Name VARCHAR(60),
Venue_Rating INT,
Monday_Times VARCHAR(15),
Tuesday_Times VARCHAR(15),
Wednesday_Times VARCHAR(15),
Thursday_Times VARCHAR(15),
Friday_Times VARCHAR(15),
Saturday_Times VARCHAR(15),
Sunday_Times VARCHAR(15),
Venue_Description TEXT,
Best_Day_To_Go VARCHAR(50),
Venue_Area INT,
Venue_Address TEXT,
Venue_Phone BIGINT,
Venue_Email VARCHAR(MAX),
Venue_Pros VARCHAR(200),
Venue_Cons VARCHAR(200),
Map_Link TEXT,
Venue_Photo VARCHAR(100),
Venue_Type VARCHAR(),
Venue_Price INT,
);

CREATE TABLE users_bucket (
venue_id INT,
user_id INT,
FOREIGN KEY (venue_id) REFERENCES Venue(venue_ID),
FOREIGN KEY (user_id) REFERENCES login_details(id)
);

CREATE TABLE plan_my_night (
venue_id INT,
user_id INT,
FOREIGN KEY (venue_id) REFERENCES Venue(venue_ID),
FOREIGN KEY (user_id) REFERENCES login_details(id)
);
