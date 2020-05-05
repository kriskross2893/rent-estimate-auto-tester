import debugLib from 'debug';

const debug = debugLib('rent-estimate:authguard');

const {
  AUTH_USER,
  AUTH_TOKEN,
} = process.env;

const authGuard = async (req, res, next) => {
  debug('AuthGuard', req.url, req.headers);

  if (req.headers && req.headers['authuser'] && req.headers['authtoken']) {
    if (
      req.headers['authtoken'] === AUTH_TOKEN
      && req.headers['authuser'] === AUTH_USER
    ) {
      next();
      return;
    }
    return res.status(403).json({
      message: 'Restricted Access'
    });
  } else {
    return res.status(403).json({
      message: 'Restricted Access'
    });
  }
};

export default authGuard;
