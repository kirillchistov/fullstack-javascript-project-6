// Инициализация Rollbar для отправки ошибок в сервис мониторинга.

import Rollbar from 'rollbar';

const noopRollbar = {
  error: () => {},
};

export default ({ accessToken, environment }) => {
  if (!accessToken) {
    return noopRollbar;
  }

  return new Rollbar({
    accessToken,
    environment,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });
};
