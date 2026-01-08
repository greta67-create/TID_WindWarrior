import Parse from "../parse-init";

/**
 * User service file to handle user-related operations between the backend (Parse) and frontend (React)
 */

// We don't need to define a User class here because Parse.User is already defined - the _User table is a reserved built-in table in Parse

/**
 * Convert a Parse User object to a plain JavaScript object
 * @param {Parse.Object} parseUser - The Parse object to convert
 * @returns {Object} Plain JavaScript object with user data
 */

export function UserToPlainObject(parseUser) {
  if (!parseUser) return null;

  // Get URL from profilepicture Parse File so that it can be used in React components
  const file = parseUser.get("profilepicture");
  const avatarUrl = file && typeof file.url === "function" ? file.url() : null;

  // Return plain object with user data
  return {
    id: parseUser.id,
    firstName: parseUser.get("firstName") || "",
    lastName: parseUser.get("lastName") || "",
    username: parseUser.get("username") || "",
    typeofSport: parseUser.get("typeofSport") || "",
    avatar: avatarUrl || "/assets/defaultAvatar.png",
    age: parseUser.get("age") ?? null,
    skillLevel: parseUser.get("skillLevel") || "",
  };
}

/**
 * Get the currently logged-in user's information (READ)
 * @returns {Object|null} - Returns user data as plain object or null if no user is logged in
 */
export async function getCurrentUserInfo() {
  try {
    const current = Parse.User.current();
    if (!current) return null;

    return UserToPlainObject(current);
  } catch (error) {
    console.error("Error getting current user info:", error);
    return null;
  }
}

/**
 * Update the current user's profile information (UPDATE)
 * @param {Object} updatedData - Object containing updated user data
 * @param {string} updatedData.firstName - Updated first name
 * @param {string} updatedData.typeofSport - Updated sport type
 * @param {string|number} updatedData.age - Updated age
 * @param {string} updatedData.skillLevel - Updated skill level
 * @param {File} [updatedData.file] - Optional new profile picture file
 * @returns {Promise<Object|null>} Updated user data or null on error
 */

export async function updateUserProfile(updatedData) {
  try {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    // Update basic user fields
    currentUser.set("firstName", updatedData.firstName);
    currentUser.set("typeofSport", updatedData.typeofSport);
    currentUser.set("age", parseInt(updatedData.age));
    currentUser.set("skillLevel", updatedData.skillLevel);

    // Handle profile picture upload if new file was selected
    if (updatedData.file) {
      const parseFile = new Parse.File(updatedData.file.name, updatedData.file);
      await parseFile.save();
      currentUser.set("profilepicture", parseFile);
    }

    // Save all changes to Parse backend
    await currentUser.save();

    // Return updated user data as plain object
    return UserToPlainObject(currentUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error; // Rethrows error to be handled by caller (Profileview.jsx)
  }
}
