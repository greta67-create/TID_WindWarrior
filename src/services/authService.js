import Parse from "parse";

// log in-function
export async function logInB4A(username, password) {
  try {
    const user = await Parse.User.logIn(username, password);

    return {
      id: user.id,
      firstName: user.get("firstName") || "",
      lastName: user.get("lastName") || "",
      username: user.get("username") || "",
      avatar: user.get("avatar") || "/assets/defaultAvatar.png", // fallback
      age: user.get("age") ?? null,
      skillLevel: user.get("skillLevel") || "",
    };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

// log out-function
/**
 * Log out the current user
 * @returns {Promise<void>}
 */
export async function logOut() {
  try {
    await Parse.User.logOut();
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
