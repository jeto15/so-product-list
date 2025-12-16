import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});



//     host: '167.88.44.199', // MySQL VPS IP address
//     user: 'admin@juanline', // Your MySQL username
//     password: 'Jetcom123!@#admin', // Your MySQL password
//     database: 'stvno' // Your MySQL database name


  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASS,
  // database: process.env.DB_NAME,