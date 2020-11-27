import rateLimit from 'express-rate-limit';

enum Messages {
  TOMANY_REQUEST = 'Too many requests',
  TOMANY_REQUEST_CREATE_ACCOUNT = 'To many attempts to register.',
  TOMANY_REQUEST_EDIT_ACCOUNT = 'To many attempts to edit.',
  TOMANY_REQUEST_LOGIN_ACCOUNT = 'Too many attempts to login.',
}

const apiRegularLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { "error": Messages.TOMANY_REQUEST }
});

const createAccountLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 19,
  message: { "error": Messages.TOMANY_REQUEST_CREATE_ACCOUNT }
});

const editAccountLimit = rateLimit({
  windowMs: 60 * 25 * 1000,
  max: 4,
  message: { "error": Messages.TOMANY_REQUEST_EDIT_ACCOUNT }
});

const loginAccountLimit = rateLimit({
  windowMs: 60 * 15 * 1000,
  max: 10,
  message: { "error": Messages.TOMANY_REQUEST_LOGIN_ACCOUNT }
});

module.exports = { apiRegularLimit, createAccountLimit, loginAccountLimit, editAccountLimit }