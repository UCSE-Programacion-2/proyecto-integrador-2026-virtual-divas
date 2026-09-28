const API_LOGIN_URL = 'http://localhost:3000/api/auth/login';
const loginForm = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');
const loginMessage = document.getElementById('login-message');

const showMessage = (message, type) => {
  loginMessage.textContent = message;
  loginMessage.className = `auth-message visible ${type}`;
};

const saveSession = (data) => {
  const token = data.token || data.accessToken || data.jwt;

  if (token) {
    localStorage.setItem('authToken', token);
  }

  if (data.user) {
    localStorage.setItem('authUser', JSON.stringify(data.user));
  }
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const credentials = {
    email: formData.get('email').trim(),
    password: formData.get('password'),
  };

  loginButton.disabled = true;
  loginButton.textContent = 'Ingresando...';
  showMessage('Validando credenciales...', 'success');

  try {
    const response = await fetch(API_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.mensaje || data.message || 'Credenciales inválidas');
    }

    saveSession(data);
    showMessage('Inicio de sesión exitoso. Redirigiendo...', 'success');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  } catch (error) {
    showMessage(error.message || 'No se pudo iniciar sesión. Intentá nuevamente.', 'error');
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Iniciar sesión';
  }
});
