import Cookies from 'js-cookie';

const TOKEN_KEY = 'hki_portal_token';

// Mengambil token dari cookie
export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

// Menyimpan token ke cookie (berlaku selama 7 hari)
export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, path: '/' });
};

// Menghapus token dari cookie
export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY, { path: '/' });
};