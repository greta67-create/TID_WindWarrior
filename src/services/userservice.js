import Parse from "parse";

/**
 * Service layer for User operations
 */

// Define the User Parse class
const User = Parse.Object.extend("_User");
const currentUser = Parse.User.current();

/**
 * Convert a Parse TodoItem object to a plain JavaScript object
 * @param {Parse.Object} parseUser - The Parse object to convert
 * @returns {Object} Plain JavaScript object with todo data
 */

function UserToPlainObject(parseUser) {
  if (!parseUser) return null; // Hvad betyder dette???

  const file = parseUser.get("profilepicture");
  const avatarUrl = file && typeof file.url === "function" ? file.url() : null;

  return {
    id: parseUser.id,
    firstName: parseUser.get("firstName"),
    lastName: parseUser.get("lastName"),
    avatar: avatarUrl,
    //avatar: parseUser.get("profilepicture") || 0, // add if then statement - if no profile picture, show something else
    age: parseUser.get("age"),
    skillLevel: parseUser.get("skillLevel"),
  };
}

// Hvad betyder hele denne???
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

// use this function to get other user profiles by ID
async function getUserByID(userId) {
  const query = new Parse.Query(User);
  query.equalTo("objectId", userId);
  try {
    const user = await query.first();
    return UserToPlainObject(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
