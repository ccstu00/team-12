import * as usersRepository from '../repositories/usersRepository.js';
import { toUserDto } from '../dtos/userDto.js';

export const attachUser = async (req, res, next) => {
  try {
    const account = req.session.userId ? await usersRepository.findById(req.session.userId) : null;

    if (account) {
      req.user = { id: account._id.toString(), email: account.email, role: account.role };
      res.locals.user = toUserDto(account);
    }
    next();
  } catch (err) {
    next(err);
  }
};
