// Английские тексты интерфейса (язык по умолчанию для i18next).

export default {
  translation: {
    appName: 'Task Manager',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        update: {
          error: 'Failed to update user',
          success: 'User updated successfully',
        },
        delete: {
          error: 'Failed to delete user',
          success: 'User deleted successfully',
        },
        onlyOwnerAccess: 'You cannot edit or delete another user',
      },
      statuses: {
        create: {
          error: 'Failed to create status',
          success: 'Status created successfully',
        },
        edit: {
          error: 'Failed to update status',
          success: 'Status updated successfully',
        },
        delete: {
          error: 'Failed to delete status',
          success: 'Status deleted successfully',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        statuses: 'Statuses',
        settings: 'Settings',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
        footer: '© Hexlet Ltd, 2021',
        toggleNavigation: 'Toggle navigation',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        firstName: 'First name',
        lastName: 'Last name',
        fullName: 'Full name',
        email: 'Email',
        password: 'Password',
        actions: 'Actions',
        updateAction: 'Edit',
        deleteAction: 'Delete',
        createdAt: 'Created at',
        new: {
          submit: 'Save',
          signUp: 'Register',
        },
        update: {
          title: 'Edit user',
          submit: 'Update',
        },
      },
      statuses: {
        heading: 'Statuses',
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        actions: {
          edit: 'Edit',
          delete: 'Delete',
          new: 'Create status',
        },
        new: {
          header: 'Create status',
          submit: 'Create',
        },
        edit: {
          header: 'Edit status',
          submit: 'Update',
        },
      },
      welcome: {
        index: {
          hello: 'Hello from Hexlet!',
          description: 'Practical programming courses',
          more: 'Learn more',
        },
      },
    },
  },
};
