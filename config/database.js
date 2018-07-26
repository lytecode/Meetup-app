require('dotenv').config()
let knex = require('knex')
//const mysql = require('mysql')

// const conex = knex({
//     client: 'mysql',
//     //connection: {
//         //host: process.env.DB_HOST,
//         //user: process.env.DB_USER,
//         //password: process.env.DB_PASSWORD,
//         //database: process.env.DATABASE
//     //}
// });

//console.log('db connection established');


let conex = knex({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'meetup'
    }
});
// DB_HOST: 'localhost'
// DB_USER: 'root'
// DB_PASSWORD: ''
// DATABASE: 'meetup'

module.exports = conex;