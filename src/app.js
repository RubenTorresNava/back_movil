import express from 'express';
import morgan from 'morgan';
import corse from 'cors';


const app = express();

app.use(morgan('dev'));
app.use(corse());
app.use(express.json());

app.get ('/', (req, res) => {
    res.send('Hello World!');
    }
);

export default app;