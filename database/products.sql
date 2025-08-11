CREATE TABLE products (
    -- SERIAL DEFAULT VALUE equates to NOT NULL AUTO_INCREMENT UNIQUE
    id INT PRIMARY KEY SERIAL DEFAULT VALUE,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    image VARCHAR(255) NOT NULL DEFAULT 'https://dummyimage.com/720x600',
    price DECIMAL(10,2) NOT NULL,
    inStock INT DEFAULT 1 NOT NULL,
    isDeleted BOOLEAN DEFAULT 0 NOT NULL
);

-- dummy data
INSERT INTO products VALUES
    (DEFAULT,'earphones',DEFAULT,'https://cdn.pixabay.com/photo/2014/04/05/11/41/earphone-316753_640.jpg',300.50,20,DEFAULT),
    (DEFAULT,'joy stick',DEFAULT,'https://cdn.pixabay.com/photo/2016/07/22/15/11/android-tv-game-controller-1535038_640.jpg',500.00,10,DEFAULT),
    (DEFAULT,'rubix cube',DEFAULT,'https://cdn.pixabay.com/photo/2019/03/03/00/35/cinema-4d-4030940_640.jpg',100.50,30,DEFAULT),
    (DEFAULT,'lighter',DEFAULT,'https://cdn.pixabay.com/photo/2017/08/17/13/09/lighter-2651263_640.jpg',20.00,50,DEFAULT),
    (DEFAULT,'television',DEFAULT,'https://cdn.pixabay.com/photo/2017/08/10/07/44/tv-2619649_640.jpg',20000.5,5,DEFAULT);