import rateLimit from 'express-rate-limit';

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: 'Você só pode fazer 5 solicitações a cada 15 minutos.',
  },
});

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: 'Você só pode fazer 100 solicitações a cada 15 minutos.',
  },
});
