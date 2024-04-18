/*Delete database if exists*/
/*DROP DATABASE IF EXISTS multibrandwnpowe_db;*/

/*Create database*/
/*CREATE DATABASE multibrandwnpowe_db;*/

/*Delete tables if exist*/
DROP TABLE IF EXISTS multibrandwnpowe_db.purchase_orders_details;
DROP TABLE IF EXISTS multibrandwnpowe_db.purchase_orders;
DROP TABLE IF EXISTS multibrandwnpowe_db.prices_lists;
DROP TABLE IF EXISTS multibrandwnpowe_db.suppliers;
DROP TABLE IF EXISTS multibrandwnpowe_db.countries;
DROP TABLE IF EXISTS multibrandwnpowe_db.measurement_units;
DROP TABLE IF EXISTS multibrandwnpowe_db.currencies_exchange;
DROP TABLE IF EXISTS multibrandwnpowe_db.currencies;
DROP TABLE IF EXISTS multibrandwnpowe_db.users;
DROP TABLE IF EXISTS multibrandwnpowe_db.users_categories;
DROP TABLE IF EXISTS multibrandwnpowe_db.brunches;

/*Create table brunches*/
CREATE TABLE multibrandwnpowe_db.brunches (
    id INT NOT NULL AUTO_INCREMENT,
    brunch VARCHAR(50) NOT NULL,
    pos_suffix VARCHAR(50) NOT NULL,
    id_currencies INT NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    address VARCHAR(300) NOT NULL,
    PRIMARY KEY (id)
);

/*Create table users_categories*/
CREATE TABLE multibrandwnpowe_db.users_categories (
    id INT NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

/*Create table users*/
CREATE TABLE multibrandwnpowe_db.users (
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

/*Create table currencies*/
CREATE TABLE multibrandwnpowe_db.currencies (
    id INT NOT NULL AUTO_INCREMENT,
    currency VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);

/*Create table currencies_exchange*/
CREATE TABLE multibrandwnpowe_db.currencies_exchange (
    id INT NOT NULL AUTO_INCREMENT,
    id_brunches INT NOT NULL,
    id_currencies INT NOT NULL,
    currency_exchange DECIMAL(7,2),
    PRIMARY KEY (id),
    FOREIGN KEY (id_brunches) REFERENCES brunches(id),
    FOREIGN KEY (id_currencies) REFERENCES currencies(id)
);


/*Create table measurement_units*/
CREATE TABLE multibrandwnpowe_db.measurement_units (
    id INT NOT NULL AUTO_INCREMENT,
    measurement_unit VARCHAR(10) NOT NULL,
    units_per_um INT NOT NULL,
    PRIMARY KEY (id)
);

/*Create table countries*/
CREATE TABLE multibrandwnpowe_db.countries (
    id INT NOT NULL AUTO_INCREMENT,
    country VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

/*Create table suppliers*/
CREATE TABLE multibrandwnpowe_db.suppliers (
    id INT NOT NULL AUTO_INCREMENT,
    supplier VARCHAR(50) NOT NULL,
    business_name VARCHAR(100) NOT NULL,
    address VARCHAR(300) NOT NULL,
    id_countries INT NOT NULL,
    id_currencies INT NOT NULL,
    cost_calculation VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_countries) REFERENCES countries(id),
    FOREIGN KEY (id_currencies) REFERENCES currencies(id)
);

/*Create table prices_lists*/
CREATE TABLE multibrandwnpowe_db.prices_lists (
    id INT NOT NULL AUTO_INCREMENT,
    id_brunches INT NOT NULL,
    id_suppliers INT NOT NULL,
    id_currencies INT NOT NULL,
    item varchar(100) NOT NULL,
    description varchar(200) NOT NULL,
    id_measurement_units INT NOT NULL,
    mu_per_box decimal(12,2) NOT NULL,
    weight_kg decimal(12,6),
    volume_m3 decimal(12,6),
    fob decimal(11,6) NOT NULL,
    brand varchar(50) NOT NULL,
    has_breaks varchar(10) NOT NULL,
    price_list_number INT NOT NULL,
    origin VARCHAR(50) NOT NULL,
    update_date date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_brunches) REFERENCES brunches(id),
    FOREIGN KEY (id_suppliers) REFERENCES suppliers(id),
    FOREIGN KEY (id_currencies) REFERENCES currencies(id),
    FOREIGN KEY (id_measurement_units) REFERENCES measurement_units(id)
);

/*Create table purchase_orders*/
CREATE TABLE multibrandwnpowe_db.purchase_orders (
    id INT NOT NULL AUTO_INCREMENT,
    purchase_order varchar(50) NOT NULL,
    po_number INT NOT NULL,
    po_date DATE NOT NULL,
    po_year INT NOT NULL,
    id_brunches INT NOT NULL,
    id_suppliers INT NOT NULL,
    id_currencies INT NOT NULL,
    total_fob_supplier_currency decimal(20,4) NOT NULL,
    total_volume_m3 decimal(20,4) NOT NULL,
    total_weight_kg decimal(20,4),
    total_boxes decimal(20,4) NOT NULL,
    cost_vs_fob decimal(5,3),
    cost_real_vs_estimated decimal(5,3),
    status varchar(50) NOT NULL,
    reception_date DATE,
    exchange_rate decimal(7,2),
    total_fob_local_currency decimal(20,4),
    freight_local_currency decimal(20,4),
    insurance_local_currency decimal(20,4),
    cif_local_currency decimal(20,4),
    forwarder_local_currency decimal(20,4),
    domestic_freight_local_currency decimal(20,4),
    dispatch_expenses_local_currency decimal(20,4),
    office_fees_local_currency decimal(20,4),
    container_costs_local_currency decimal(20,4),
    port_expenses_local_currency decimal(20,4),
    duties_tarifs_local_currency decimal(20,4),
    container_insurance_local_currency decimal(20,4),
    port_contribution_local_currency decimal(20,4),
    other_expenses_local_currency decimal(20,4),
    total_expenses_local_currency decimal(20,4),
    total_costs_local_currency decimal(20,4),
    total_volume_expense_local_currency decimal(20,4),
    total_price_expense_local_currency decimal(20,4),
    cost_calculation VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_brunches) REFERENCES brunches(id),
    FOREIGN KEY (id_suppliers) REFERENCES suppliers(id),
    FOREIGN KEY (id_currencies) REFERENCES currencies(id)
);

/*Create table purchase_orders_details*/
CREATE TABLE multibrandwnpowe_db.purchase_orders_details (
    id INT NOT NULL AUTO_INCREMENT,
    id_brunches INT NOT NULL,
    id_pos INT NOT NULL,
    item varchar(100) NOT NULL,
    description varchar(200) NOT NULL,
    id_measurement_units INT NOT NULL,
    mu_quantity decimal(20,6) NOT NULL,
    units_quantity INT NOT NULL,
    mu_per_box decimal(5,2) NOT NULL,
    boxes decimal (6,2) NOT NULL,
    weight_kg decimal(11,3),
    total_weight_kg decimal(11,3),
    volume_m3 decimal(11,6),
    total_volume_m3 decimal(11,6),
    fob_supplier_currency decimal(11,6) NOT NULL,
    total_fob_supplier_currency decimal(11,6) NOT NULL,
    brand varchar(50) NOT NULL,
    pays_duties_tarifs varchar(50) NOT NULL,
    total_fob_local_currency decimal(20,4),
    freight_and_insurance_local_currency decimal(20,4),
    cif_local_currency decimal(20,4),
    duties_tarifs_local_currency decimal(20,4),
    total_volume_expense_local_currency decimal(20,4),
    total_price_expense_local_currency decimal(20,4),
    total_expense_local_currency decimal(20,4),
    total_cost_local_currency decimal(20,4),
    unit_cost_local_currency decimal(20,4),
    unit_cost_supplier_currency decimal(20,4),
    PRIMARY KEY (id),
    FOREIGN KEY (id_pos) REFERENCES purchase_orders(id),
    FOREIGN KEY (id_measurement_units) REFERENCES measurement_units(id),
    FOREIGN KEY (id_brunches) REFERENCES brunches(id)
);


