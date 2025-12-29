import Parse from "parse";

/**
 * User service file to handle user-related operations
 */

/**
 * Convert a Parse User object to a plain JavaScript object
 * @param {Parse.Object} parseUser - The Parse object to convert
 * @returns {Object} Plain JavaScript object with user data
 */
export function UserToPlainObject(parseUser) {
  if (!parseUser) return null;

  // Get avatar URL from profilepicture Parse File
  const file = parseUser.get("profilepicture");
  const avatarUrl = file && typeof file.url === "function" ? file.url() : null;

  return {
    id: parseUser.id,
    firstName: parseUser.get("firstName") || "",
    lastName: parseUser.get("lastName") || "",
    username: parseUser.get("username") || "",
    typeofSport: parseUser.get("typeofSport") || "",
    avatar: avatarUrl || "/assets/defaultAvatar.png", // fallback
    age: parseUser.get("age") ?? null,
    skillLevel: parseUser.get("skillLevel") || "",
  };
}

/**
 * Get the currently logged-in user's information
 * @returns {Object|null} User data or null if not logged in or on error
 */
export async function getCurrentUserInfo() {
  try {
    const current = Parse.User.current();
    if (!current) return null;

    return UserToPlainObject(current); // React can't handle complex Parse objects, so we convert them to plain objects like here
  } catch (error) {
    // if error, return null - this is a fallback to prevent that the app crashes
    console.error("Error getting current user info:", error);
    return null;
  }
}

/**
 * Update the current user's profile information
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
    throw error; // Re-throw so component can handle it
  }
}
