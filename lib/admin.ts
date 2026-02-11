const ADMIN_EMAILS = [
  'nikolas@forchiefs.com',
]

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
