-- MySQL Database Initialization Script
-- Auto-executed by official MySQL Docker container on startup

CREATE DATABASE IF NOT EXISTS db_user;
CREATE DATABASE IF NOT EXISTS db_restaurant;
CREATE DATABASE IF NOT EXISTS db_order;
CREATE DATABASE IF NOT EXISTS db_payment;

-- Grant all privileges to the root account for these schemas (default in local Docker instance)
GRANT ALL PRIVILEGES ON db_user.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON db_restaurant.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON db_order.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON db_payment.* TO 'root'@'%';

FLUSH PRIVILEGES;
