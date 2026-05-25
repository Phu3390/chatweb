const TOKEN_KEY = "access_token"
const JSESSIONID = "JSESSIONID"

export const cookieStorage = {
  setToken(token: string, days = 7): void {
    const maxAge = days * 24 * 60 * 60

    document.cookie =
      `${TOKEN_KEY}=${encodeURIComponent(token)}; ` +
      `path=/; ` +
      `max-age=${maxAge}; ` +
      `samesite=strict`
  },

  getToken(): string | null {
    const cookies = document.cookie.split("; ")

    for (const cookie of cookies) {
      const [key, value] = cookie.split("=")

      if (key === TOKEN_KEY) {
        return decodeURIComponent(value)
      }
    }

    return null
  },

  removeToken(): void {
    document.cookie =
      `${TOKEN_KEY}=; ` +
      `path=/; ` +
      `expires=Thu, 01 Jan 1970 00:00:00 GMT; ` +
      `samesite=strict`
  },

  hasToken(): boolean {
    return !!this.getToken()
  },

  removeSession(): void {
    document.cookie =
      `${JSESSIONID}=; ` +
      `path=/; ` +
      `expires=Thu, 01 Jan 1970 00:00:00 GMT; ` +
      `samesite=strict`
  }
}