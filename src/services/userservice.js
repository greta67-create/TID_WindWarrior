import Parse from "parse";

/**
 * User service file to handle user-related operations
 */

/**
 * Convert a Parse User object to a plain JavaScript object
 * @param {Parse.Object} parseUser - The Parse object to convert
 * @returns {Object} Plain JavaScript object with user data
 */
function UserToPlainObject(parseUser) {
  if (!parseUser) return null;

  const file = parseUser.get("profilepicture");
  const avatarUrl = file && typeof file.url === "function" ? file.url() : null;

  return {
    id: parseUser.id,
    firstName: parseUser.get("firstName"),
    typeofSport: parseUser.get("typeofSport"),
    avatar: avatarUrl,
    age: parseUser.get("age"),
    skillLevel: parseUser.get("skillLevel"),
  };
}

/**
 * Get the currently logged-in user's information
 * @returns {Object|null} User data or null if not logged in
 */
export async function getCurrentUserInfo() {
  const current = Parse.User.current();
  if (!current) return null;

  try {
    const fresh = await current.fetch();
    return UserToPlainObject(fresh);
  } catch (error) {
    console.warn("Error fetching current user info:", error);
    return UserToPlainObject(current);
  }
}
