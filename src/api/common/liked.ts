/**
 * @description Saber si el usuario actual le ha dado like
 * @param userId
 * @param likedBy
 */
export const isLikedByCurrentUser = (userId: string, likedBy: string) => {

  if (userId === likedBy) {
    return true
  } else {
    return false
  }
}