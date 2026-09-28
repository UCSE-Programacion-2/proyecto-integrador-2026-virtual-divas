const API_REGISTER_URL = 'http://localhost:3000/api/auth/register';
const registerForm = document.getElementById('register-form');
const registerButton = document.getElementById('register-button');
const registerMessage = document.getElementById('register-message');

const showRegisterMessage = (message, type) => {
  registerMessage.textContent = message;
  registerMessage.className = `auth-message visible ${type}`;
};

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const userData = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    password: formData.get('password'),
  };

  registerButton.disabled = true;
  registerButton.textContent = 'Creando cuenta...';
  showRegisterMessage('Enviando datos de registro...', 'success');

  try {
    const response = await fetch(API_REGISTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.mensaje || data.message || 'No se pudo crear la cuenta');
    }

    registerForm.reset();
    showRegisterMessage('Cuenta creada correctamente. Redirigiendo al login...', 'success');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  } catch (error) {
    showRegisterMessage(error.message || 'No se pudo completar el registro. Intentá nuevamente.', 'error');
  } finally {
    registerButton.disabled = false;
    registerButton.textContent = 'Crear cuenta';
  }
});
