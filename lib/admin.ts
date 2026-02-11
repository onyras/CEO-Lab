const ADMIN_EMAILS = [
  'kokuah@gmail.com',
  'nikolas@nikolaskonstantin.com',
]

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
