import apiClient from './client';

// Cambia a false en cuanto tu compañero de backend tenga /auth/login y /auth/register listos
const USE_MOCK = true;

export async function login(email, contrasena) {
  if (USE_MOCK) {
    return mockLogin(email, contrasena);
  }
  const response = await apiClient.post('/auth/login', { email, contrasena });
  return response.data; // se espera { access_token, usuario }
}

export async function register(datosUsuario) {
  if (USE_MOCK) {
    return mockRegister(datosUsuario);
  }
  const response = await apiClient.post('/auth/register', datosUsuario);
  return response.data;
}

// ---- Mocks temporales (bórralos cuando el backend esté listo) ----
function mockLogin(email, contrasena) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (contrasena.length >= 6) {
        resolve({
          access_token: 'token-falso-de-prueba',
          usuario: { usuarioId: 1, primerNombre: 'Usuario', primerApellido: 'Prueba', email },
        });
      } else {
        reject({ response: { data: { message: 'Credenciales inválidas' } } });
      }
    }, 500); // simula latencia de red
  });
}

function mockRegister(datosUsuario) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ usuarioId: Math.floor(Math.random() * 1000), ...datosUsuario });
    }, 500);
  });
}