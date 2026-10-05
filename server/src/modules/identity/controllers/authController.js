import {
  authenticateUser,
  createAccessToken,
  getUserById,
  registerUser,
  serializeUser
} from '../services/authService.js';
import { validateLoginInput, validateRegistrationInput } from '../validation/authValidation.js';

export async function register(request, response, next) {
  try {
    const input = validateRegistrationInput(request.body);
    const user = await registerUser(input);

    response.status(201).json({
      token: createAccessToken(user),
      user: serializeUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const input = validateLoginInput(request.body);
    const user = await authenticateUser(input);

    response.status(200).json({
      token: createAccessToken(user),
      user: serializeUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(request, response, next) {
  try {
    const user = await getUserById(request.user.id);
    response.status(200).json({ user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
}
