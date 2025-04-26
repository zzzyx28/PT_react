// Simulate user storage in localStorage
const USER_KEY = 'mockUser';

export const mockRegister = ({ username, password }) => {
  const saved = localStorage.getItem(USER_KEY);
  if (saved) {
    const user = JSON.parse(saved);
    if (user.username === username) {
      return Promise.reject(new Error('Username already exists'));
    }
  }

  localStorage.setItem(USER_KEY, JSON.stringify({ username, password }));
  return Promise.resolve({ message: 'Registered successfully' });
};

export const mockLogin = ({ username, password }) => {
  const saved = localStorage.getItem(USER_KEY);
  if (!saved) {
    return Promise.reject(new Error('No user found'));
  }

  const user = JSON.parse(saved);
  if (user.username === username && user.password === password) {
    // Simulate token
    return Promise.resolve({ token: 'fake-jwt-token', username });
  }

  return Promise.reject(new Error('Invalid username or password'));
};

export const mockLogout = () => {
  return Promise.resolve({ message: 'Logged out successfully' });
};
