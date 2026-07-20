// Русские тексты интерфейса — совпадают с демо https://js-task-manager-ru.hexlet.app/

export default {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось изменить пользователя',
          success: 'Пользователь успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
        },
        onlyOwnerAccess: 'Вы не можете редактировать или удалять другого пользователя',
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        edit: {
          error: 'Не удалось изменить статус',
          success: 'Статус успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удалён',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        edit: {
          error: 'Не удалось изменить задачу',
          success: 'Задача успешно изменена',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          accessError: 'Задачу может удалить только её автор',
          success: 'Задача успешно удалена',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        tasks: 'Задачи',
        settings: 'Настройки',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        footer: '© Hexlet Ltd, 2021',
        toggleNavigation: 'Переключить навигацию',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        firstName: 'Имя',
        lastName: 'Фамилия',
        fullName: 'Полное имя',
        email: 'Email',
        password: 'Пароль',
        actions: 'Действия',
        updateAction: 'Изменить',
        deleteAction: 'Удалить',
        createdAt: 'Дата создания',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        update: {
          title: 'Изменение пользователя',
          submit: 'Изменить',
        },
      },
      statuses: {
        heading: 'Статусы',
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: {
          edit: 'Изменить',
          delete: 'Удалить',
          new: 'Создать статус',
        },
        new: {
          header: 'Создание статуса',
          submit: 'Создать',
        },
        edit: {
          header: 'Изменение статуса',
          submit: 'Изменить',
        },
      },
      tasks: {
        heading: 'Задачи',
        id: 'ID',
        name: 'Наименование',
        description: 'Описание',
        status: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        createdAt: 'Дата создания',
        actions: {
          edit: 'Изменить',
          delete: 'Удалить',
          new: 'Создать задачу',
        },
        new: {
          header: 'Создание задачи',
          submit: 'Создать',
        },
        edit: {
          header: 'Изменение задачи',
          submit: 'Изменить',
        },
        show: {
          back: 'Назад',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
