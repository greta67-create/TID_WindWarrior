import Parse from "parse";
import { UserToPlainObject } from "./userservice";

// log in-function
export async function logInB4A(username, password) {
  try {
    const user = await Parse.User.logIn(username, password);
    return UserToPlainObject(user);
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
