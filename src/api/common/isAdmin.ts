import { AppRoles } from '../../app.roles';

export const isAdmin = (role: string) => {
  switch (role) {
    case AppRoles.SUPER_ADMIN:
    case AppRoles.ADMIN:
    case AppRoles.MODERATOR:
      return true
    default:
      return false
  }
}