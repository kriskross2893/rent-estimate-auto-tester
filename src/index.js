import './config';

import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import debugLib from 'debug';

import db from './model';
import rentEstimate from './routes/rentEstimate';
import properties from './routes/properties';
import authGuard from './authGuard';

const port = process.env.PORT;
const host = process.env.HOST;

const debug = debugLib('rent-estimate:server');

const app = express();

app.use(bodyParser.json());
app.use(helmet());

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.use(authGuard);

app.use('/rent-estimate', rentEstimate);
app.use('/properties', properties);

let listener;
export const startApp = callback => {
  db.connect(() => {
    listener = app.listen(port, host, async () => {
      if (callback) {
        callback(db);
      }

      const address = listener.address().address;
      debug(`Server listening on http://[${address}]:${port} (PID ${process.pid})`);
    });
  });
};

export const stopApp = callback => {
  return listener.close(callback);
};

export const getListener = () => {
  return listener;
};

/* istanbul ignore if */
if (require.main === module) {
  startApp();
}

export default startApp;
