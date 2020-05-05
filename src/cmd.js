import './config';

import express from 'express';
import debugLib from 'debug';

const debug = debugLib('rent-estimate:scripts');
const app = express();

app.start = () => {
  debug('starting scripts');
  try {
    if (!process.argv[2]) {
      throw Error('no command found');
    }

    debug(`script: ${process.argv[2]}`);
    debug(`function: ${process.argv[3]}`);

    const file = process.argv[2];
    const func = process.argv[3];

    require(`../${file}`)[func]().run(app)
      .then(res => {
        debug(res);
        process.exit();
      })
      .catch(err => {
        debug(err);
        process.exit(1);
      });
  } catch (err) {
    debug(err);
    process.exit(1);
  }
};

app.start();
