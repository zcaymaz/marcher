import * as express from 'express';

export const getCookieOptions = (): express.CookieOptions => {
  const isProd = process.env.NODE_ENV === 'production';
  const domain = process.env.COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'lax' : 'lax',
    domain: isProd ? domain : undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const getClearCookieOptions = (): express.CookieOptions => {
  const isProd = process.env.NODE_ENV === 'production';
  const domain = process.env.COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'lax' : 'lax',
    domain: isProd ? domain : undefined,
  };
};
