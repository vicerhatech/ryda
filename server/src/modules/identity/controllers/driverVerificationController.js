import { getDriverVerification, submitDriverVerification } from '../services/driverVerificationService.js';
import { validateDriverVerificationInput } from '../validation/driverVerificationValidation.js';

export async function submitVerification(request, response, next) {
  try {
    const submission = validateDriverVerificationInput(request.body);
    const profile = await submitDriverVerification(request.user.id, submission);
    response.status(201).json({ profile });
  } catch (error) {
    next(error);
  }
}

export async function getMyVerification(request, response, next) {
  try {
    const profile = await getDriverVerification(request.user.id);
    response.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
}
