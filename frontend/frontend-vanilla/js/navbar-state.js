const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

const getStoredUser = () => {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('No se pudo leer el usuario guardado:', error);
    return null;
  }
};

const removeAuthItems = (navbarList) => {
  const authLinks = navbarList.querySelectorAll('a[href="login.html"], a[href="register.html"]');
  authLinks.forEach((link) => link.closest('li')?.remove());

  navbarList.querySelectorAll('[data-auth-nav]').forEach((item) => item.remove());
};

const createNavItem = (content) => {
  const item = document.createElement('li');
  item.dataset.authNav = 'true';
  item.appendChild(content);
  return item;
};

const createAuthLink = (href, text) => {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;

  if (window.location.pathname.endsWith(href)) {
    link.classList.add('active', 'activo');
  }

  return createNavItem(link);
};

const renderLoggedOutNav = (navbarList) => {
  navbarList.appendChild(createAuthLink('login.html', 'Iniciar sesión'));
};

const renderLoggedInNav = (navbarList, user) => {
  const userItem = document.createElement('li');
  userItem.className = 'navbar-user';
  userItem.dataset.authNav = 'true';
  userItem.textContent = `Hola, ${user?.name || 'Mi cuenta'}`;

  const logoutButton = document.createElement('button');
  logoutButton.type = 'button';
  logoutButton.className = 'navbar-logout';
  logoutButton.textContent = 'Cerrar sesión';
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = 'index.html';
  });

  navbarList.appendChild(userItem);
  navbarList.appendChild(createNavItem(logoutButton));
};

const updateNavbarState = () => {
  const navbarList = document.querySelector('.navbar-menu, .navbar-links');

  if (!navbarList) {
    return;
  }

  removeAuthItems(navbarList);

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const user = getStoredUser();

  if (token) {
    renderLoggedInNav(navbarList, user);
    return;
  }

  renderLoggedOutNav(navbarList);
};

updateNavbarState();
