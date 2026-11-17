import * as authService from '../services/authService.js';
import * as usersRepository from '../repositories/usersRepository.js';
import { toUserDto } from '../dtos/userDto.js';

const fromForm = (req) => Boolean(req.is('application/x-www-form-urlencoded'));

const startSession = (req, res, userId, next) => {
  req.session.regenerate((err) => {
    if (err) return next(err);

    req.session.userId = userId;

    if (req.body.rememberMe) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
    }
    req.session.save((err) => {
      if (err) return next(err);

      if (fromForm(req)) {
        res.redirect(303, "/listings");
        return;
      }
      res.status(200).json({ loggedIn: true });
    });
  });
};

export const signupPage = (req, res) => {
  if (req.user) return res.redirect('/listings');
  res.render('signup', { title: 'Sign up', error: null, email: '' });
};

export const loginPage = (req, res) => {
  if (req.user) return res.redirect('/listings');
  res.render('login', { title: 'Log in', error: null, email: '' });
};

export const signup = async (req, res, next) => {
  const result = await authService.signup(req.body);
  if (!fromForm(req)) {
    if (!result.ok) {
      res.status(result.error.status).json({ error: result.error.message });
      return;
    }
    res.status(201).json(result.value);
    return;
  }
  if (!result.ok) {
    res.status(result.error.status).render('signup', { title: 'Sign up', error: result.error.message, email: req.body.email || '' });
    return;
  }
  startSession(req, res, result.value.id, next);
};

export const login = async (req, res, next) => {
  const result = await authService.login(req.body);
  if (!result.ok) {
    if (fromForm(req)) {
      res.status(result.error.status).render('login', { title: 'Log in', error: result.error.message, email: req.body.email || '' });
      return;
    }
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }

  startSession(req, res, result.value.id, next);
};

export const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");

    if (fromForm(req)) {
      res.redirect(303, "/login");
      return;
    }
    res.status(200).send("");
  });
};

export const me = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'not logged in' });
    return;
  }

  const user = await usersRepository.findById(req.user.id);
  if (!user) {
    res.status(401).json({ error: 'not logged in' });
    return;
  }

  res.status(200).json(toUserDto(user));
};
