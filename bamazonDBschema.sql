CREATE DATABASE bamazon_db;
USE bamazon_db;
SELECT * FROM products;
SELECT * FROM departments;

CREATE TABLE products (
  id INT(11) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT(11) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Camo Snuggie', 'Must Haves', 16.95, 82);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Silly Putty', 'Must Haves', 4.35, 100);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Easy Bake Oven', 'Must Haves', 30.15, 45);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Mr. Sketch Scented Markers', 'Must Haves', 12.05, 77);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Gold Plated USB Mouse', 'Lux Mart', 205.35, 36);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Cashmere Dishtowel', 'Lux Mart', 85.85, 82);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Silver Dog Dish', 'Lux Mart', 180.97, 82);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Royal Jelly Eye Serum', 'Lux Mart', 233.05, 67);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Coca Cola Baby Bottle', 'Bubba Mart', 4.05, 102);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Tire on a Rope', 'Bubba Mart', 20.10, 400);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Gator Trap', 'Bubba Mart', 35.95, 37);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Possum', 'Bubba Mart', 1.95, 74);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Corn', 'Cans-o-Stuff', 1.33, 39);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Quail', 'Cans-o-Stuff', 2.95, 84);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Pimento Cheese', 'Cans-o-Stuff', 2.15, 66);
INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES ('Dryer Lint', 'Cans-o-Stuff', 4.45, 66);

CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(100) NOT NULL,
	overhead_cost DECIMAL(10,2) NOT NULL,
	total_sales DECIMAL(10,2),
	PRIMARY KEY(department_id)
);

INSERT INTO departments(department_name, overhead_cost) VALUES('Must Haves', 300);
INSERT INTO departments(department_name, overhead_cost) VALUES('Lux Mart', 600);
INSERT INTO departments(department_name, overhead_cost) VALUES('Bubba Mart', 500);
INSERT INTO departments(department_name, overhead_cost) VALUES('Cans-o-Stuff', 200);