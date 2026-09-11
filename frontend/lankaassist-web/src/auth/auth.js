export function saveAuthentication(loginResponse) {
  sessionStorage.setItem(
    "token",
    loginResponse.accessToken
  );

  sessionStorage.setItem(
    "user",
    JSON.stringify({
      userId: loginResponse.userId,
      email: loginResponse.email,
      role: loginResponse.role,
      anonymousDonor: loginResponse.anonymousDonor,
    })
  );
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export function getCurrentUser() {
  const storedUser = sessionStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function logout() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}
