import debugLib from 'debug';
import jwt from 'jsonwebtoken';

const debug = debugLib('rent-estimate:authguard');

const {
  AUTH_USER,
  AUTH_TOKEN,
} = process.env;

const matchUserAndToken = (user, token) => {
  const [foyerUser, stockroomUser] = AUTH_USER.split(',');
  const [foyerToken, stockroomToken] = AUTH_TOKEN.split(',');

  if (user === foyerUser && token === foyerToken) {
    return true;
  }
  if (user === stockroomUser && token === stockroomToken) {
    return true;
  }

  return false;
};

const authGuard = async (req, res, next) => {
  debug('AuthGuard', req.url);

  if (req.headers && req.headers['authorization']) {
    const [bearer, auth] = req.headers.authorization.split(' ');
    const {user, token} = await jwt.decode(auth);
    if (matchUserAndToken(user, token)) {
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
