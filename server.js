import dotenv from 'dotenv';
import { connectToDB } from './src/config/connection.db.js';
import { app } from './src/app.js';

dotenv.config();

connectToDB()
    .then(() => {
        app.on('error', (err) => {
            console.log('Error: ' + err.message);
            throw err;
        });

        // console.log(process.env.PORT);
        app.listen(8080, () => {
            console.log(`Example app listening on port ${8080}`);
        });
    })
    .catch(err => {
        console.log('MONGODB connection FAILED: ', err);
    })