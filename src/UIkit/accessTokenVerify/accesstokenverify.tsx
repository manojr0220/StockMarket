const parseJwt = (token?: any) => {
  try {
    const base64Url = token.split(".")[1]; // Get payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = JSON.parse(atob(base64));
    return jsonPayload;
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token?: any) => {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true; // If decoding fails, assume expired
  return decoded.exp < Math.floor(Date.now() / 1000);
};
