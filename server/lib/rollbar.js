// Инициализация Rollbar для отправки ошибок в сервис мониторинга.
// Нужен серверный токен post_server_item (ROLLBAR_ACCESS_TOKEN), не post_client_item.

import Rollbar from 'rollbar';

const noopRollbar = {
  error: () => {},
  wait: (callback) => {
    if (typeof callback === 'function') {
      callback();
    }
  },
};

export const getRollbarAccessToken = () => (
  process.env.ROLLBAR_ACCESS_TOKEN
  || process.env.VITE_ROLLBAR_ACCESS_TOKEN
);

export default ({ accessToken, environment, log }) => {
  if (!accessToken) {
    log?.warn('Rollbar: set ROLLBAR_ACCESS_TOKEN (post_server_item) to report server errors');
    return noopRollbar;
  }

  if (!process.env.ROLLBAR_ACCESS_TOKEN && process.env.VITE_ROLLBAR_ACCESS_TOKEN) {
    log?.warn(
      'Rollbar: VITE_ROLLBAR_ACCESS_TOKEN is usually a client token (post_client_item). '
      + 'Create a post_server_item token in Rollbar and set ROLLBAR_ACCESS_TOKEN.',
    );
  }

  return new Rollbar({
    accessToken,
    environment,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });
};
