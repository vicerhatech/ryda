import {
  acceptCourierDelivery,
  cancelSenderCourierDelivery,
  createCourierDelivery,
  getSenderCourierDeliveries,
  getSenderCourierDelivery,
  updateCourierDeliveryStatus
} from './courier.service.js';
import { emitCourierAccepted, emitCourierStatusUpdate } from './courier.socket.js';

export async function createCourier(request, response, next) {
  try {
    const courier = await createCourierDelivery(request.user.id, request.body);
    return response.status(201).json({ courier });
  } catch (error) {
    return next(error);
  }
}

export async function getMyCourierDeliveries(request, response, next) {
  try {
    const courier = await getSenderCourierDeliveries(request.user.id);
    return response.status(200).json({ courier });
  } catch (error) {
    return next(error);
  }
}

export async function getCourierById(request, response, next) {
  try {
    const courier = await getSenderCourierDelivery(request.user.id, request.params.id);
    return response.status(200).json({ courier });
  } catch (error) {
    return next(error);
  }
}

export async function cancelCourier(request, response, next) {
  try {
    const result = await cancelSenderCourierDelivery(request.user.id, request.params.id);
    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function acceptCourier(request, response, next) {
  try {
    const courier = await acceptCourierDelivery(request.user.id, request.params.id);
    emitCourierAccepted(courier);
    return response.status(200).json({ courier });
  } catch (error) {
    return next(error);
  }
}

export async function updateCourierStatus(request, response, next) {
  try {
    const courier = await updateCourierDeliveryStatus(request.user.id, request.params.id, request.body.status);
    emitCourierStatusUpdate(courier);
    return response.status(200).json({ courier });
  } catch (error) {
    return next(error);
  }
}
