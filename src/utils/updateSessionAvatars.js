import Parse from "../parse-init";

/**
 * Get current user's avatar info for updating session avatars
 * @returns {Object|null} User object with id and avatar, or null if not logged in
 */
export function getCurrentUserAvatar() {
  const user = Parse.User.current();
  if (!user) return null;

  const profilePicture = user.get("profilepicture");
  const avatarUrl = profilePicture && typeof profilePicture.url === "function"
    ? profilePicture.url()
    : null;

  return {
    id: user.id,
    avatar: avatarUrl,
  };
}

/**
 * Add current user's avatar to a session's joined users
 * @param {Object} session - The session object
 * @returns {Object} Updated session with user added
 */
export function addCurrentUserToSession(session) {
  const currentUser = getCurrentUserAvatar();
  if (!currentUser) return session;

  // Check if already in list
  const alreadyJoined = session.joinedUsers?.some(u => u.id === currentUser.id);
  if (alreadyJoined) return session;

  return {
    ...session,
    joinedUsers: [...(session.joinedUsers || []), currentUser].slice(0, 3),
    joinedCount: (session.joinedCount || 0) + 1,
  };
}

/**
 * Remove current user's avatar from a session's joined users
 * @param {Object} session - The session object
 * @returns {Object} Updated session with user removed
 */
export function removeCurrentUserFromSession(session) {
  const currentUser = getCurrentUserAvatar();
  if (!currentUser) return session;

  return {
    ...session,
    joinedUsers: (session.joinedUsers || []).filter(u => u.id !== currentUser.id),
    joinedCount: Math.max(0, (session.joinedCount || 0) - 1),
  };
}

