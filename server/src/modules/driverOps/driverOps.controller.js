import AppError from '../../shared/utils/AppError.js';
import {
  buildDashboard,
  getAvailableRequests,
  setAvailability
} from './driverOps.service.js';

export async function updateDriverAvailability(request, response, next) {
  try {
    const { isOnline } = request.body;

    if (typeof isOnline !== 'boolean') {
      throw new AppError('isOnline must be a boolean.', 400);
    }

    const availability = await setAvailability(request.user.id, isOnline);
    return response.status(200).json({ availability });
  } catch (error) {
    return next(error);
  }
}

export async function getDriverDashboard(request, response, next) {
  try {
    const dashboard = await buildDashboard(request.user.id);
    return response.status(200).json({ dashboard });
  } catch (error) {
    return next(error);
  }
}

export async function getDriverRequests(request, response, next) {
  try {
    const requests = await getAvailableRequests(request.user.id);
    return response.status(200).json({ requests });
  } catch (error) {
    return next(error);
  }
}
