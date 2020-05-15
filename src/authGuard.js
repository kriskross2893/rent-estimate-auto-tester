import debugLib from 'debug';
import jwt from 'jsonwebtoken';
import isEmpty from 'lodash/isEmpty';

const debug = debugLib('rent-estimate:authguard');

const {
  AUTH_USER,
  AUTH_TOKEN,
  AUTH_SECRET
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

const verifyAuthorization = (authHeader) => {
  const [foyerSecret, stockroomSecret] = AUTH_SECRET.split(',');
  try {
    const token = jwt.verify(authHeader, foyerSecret);
    if (token && !isEmpty(token)) {
      return token;
    }
  } catch (error) {
    // do nothing
  }
  try {
    const token = jwt.verify(authHeader, stockroomSecret);
    if (token && !isEmpty(token)) {
      return token;
    }
  } catch (error) {
    // do nothing
  }
  return {};
};

const authGuard = async (req, res, next) => {
  debug('AuthGuard', req.url);

  if (req.headers && req.headers['authorization']) {
    const [bearer, auth] = req.headers.authorization.split(' ');
    const {user, token} = verifyAuthorization(auth);
    if (
      user
      && token
      && matchUserAndToken(user, token)
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
