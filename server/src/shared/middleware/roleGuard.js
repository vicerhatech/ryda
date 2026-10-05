import AppError from '../utils/AppError.js';

export function requireRole(...roles) {
  return (request, _response, next) => {
    if (!request.user || !roles.includes(request.user.role)) {
      return next(new AppError('You are not authorized to perform this action.', 403));
    }

    return next();
  };
}
