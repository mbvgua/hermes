CREATE TABLE orders (
    id INT PRIMARY KEY SERIAL DEFAULT VALUE,
    userId INT NOT NULL,
    orderDetails JSON,
    totalPrice DECIMAL(10,2) NOT NULL,
    isCancelled BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- dummy data
INSERT INTO orders VALUES
    (DEFAULT,2,'{"itemId":1,"itemQuantity":3,"itemPrice":300.50}',901.50,0),
    (DEFAULT,3,'{"itemId":2,"itemQuantity":5,"itemPrice":500.00}',2500.00,0),
    (DEFAULT,4,'{"itemId":4,"itemQuantity":1,"itemPrice":20.00}',20.00,0);
