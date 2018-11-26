import express from 'express';
import bodyParser from 'body-parser';
import UserApiRouter from './UserApiRouter';
import { ValidationError } from 'class-validator';

export default function run(port: number) {
  const app = express();

  app.use(bodyParser.json());

  app.get('/', (req, res) => {
    console.log('hi');
    res.send('hi');
  });

  app.use('/user', UserApiRouter);

  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      const validationError = err;
      return res.send({
        errorCode: Object.values(validationError.constraints)[0],
      }).status(400);
    }
    next(err);
  })

  app.listen(port, () => {
    console.log(`server listen ${port}`)
  });
}
