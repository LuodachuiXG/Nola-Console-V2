import SecureLS from 'secure-ls'

const ls = new SecureLS({
  isCompression: true,
  encryptionSecret: import.meta.env.VITE_ENCRYPTION_KEY
})

export const SecureLSStorage = {
  setItem(name: string, value: string) {
    ls.set(name, value);
  },
  getItem(name: string): string {
    return ls.get(name)
  },
  removeItem(key: string) {
    ls.remove(key);
  }
}