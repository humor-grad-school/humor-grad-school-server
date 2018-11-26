import express from 'express';

const app = express();

app.get('/', (req, res) => {
    console.log('hi');
    res.send('hi');
});

app.listen(8080);
