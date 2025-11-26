import Parse from "../parse-init";
import sessionToPlainObject from "./sessionService";

// Service layer for UserSession operations
const UserSessions = Parse.Object.extend("UserSessions");
/**
 * Fetch all sessions for a given user from the UserSessions join table
 * @param {Parse.User} user - The current logged-in user
 * @returns {Promise<Array>} Array of sessions as plain JS objects
 */

export async function fetchUserSessions(user) {
  if (!user) {
    throw new Error("User must be provided to fetch user sessions");
  }

  const query = new Parse.Query(UserSessions);

  // Filter by current user and fetch related data
  query.equalTo("userId", user);
  query.include("surfSession"); // include the SurfSessions object
  query.include("surfSession.spotId"); // include the Spot for the session

  try {
    const userSessionsData = await query.find();

    // For each UserSessions row, take its surfSession and convert to plain object
    const sessions = userSessionsData
      .map((userSession) => userSession.get("surfSession"))
      .map(sessionToPlainObject);

    return sessions;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    throw error;
  }
}

// missing: fetchallUsersessions

/**
 * Create a UserSessions entry for a given user and session
 * This is what happens when the user clicks "Join"
 *
 * @param {Parse.User} user      The logged-in user
 * @param {string} surfSession     The objectId of the SurfSessions
 * @returns {Promise<Parse.Object>} The created or existing UserSessions object
 */
export async function createUserSession(user, surfSession) {
  if (!user) {
    throw new Error("User must be provided to create a user session");
  }
  if (!surfSession) {
    throw new Error("Session ID must be provided");
  }

  // Pointer to the SurfSessions
  const sessionPointer = new Parse.Object("SurfSessions");
  sessionPointer.id = surfSession;

  // Find the UserSessions row for this user and this session
  const query = new Parse.Query(UserSessions);
  query.equalTo("userId", user);
  query.equalTo("surfSession", sessionPointer);

  const existing = await query.first();

  if (existing) {
    // Already joined, just return the existing record
    return existing;
  }

  // Create new UserSessions row if no existing session
  const userSession = new UserSessions();
  userSession.set("userId", user); // pointer to _User
  userSession.set("surfSession", sessionPointer); // pointer to SurfSessions

  const result = await userSession.save();
  return result;
}

/**
 * Delete the UserSessions entry for a given user and session
 * This is what happens when the user clicks "Unjoin"
 *
 * @param {Parse.User} user      The logged-in user
 * @param {string} surfSession     The objectId of the SurfSessions
 * @returns {Promise<void>}
 */

export async function deleteUserSession(user, surfSession) {
  if (!user) {
    throw new Error("User must be provided to delete a user session");
  }
  if (!surfSession) {
    throw new Error("Session ID must be provided to delete a user session");
  }

  // Pointer to the SurfSessions
  const sessionPointer = new Parse.Object("SurfSessions");
  sessionPointer.id = surfSession;

  // Find the UserSessions row for this user and this session
  const query = new Parse.Query(UserSessions);
  query.equalTo("userId", user);
  query.equalTo("surfSession", sessionPointer);

  try {
    const userSession = await query.first();

    if (!userSession) {
      // Nothing to delete, return
      console.warn("No user session found to delete");
      return;
    }
    // delete user session if found
    await userSession.destroy();
  } catch (error) {
    console.error("Error deleting user session:", error);
    throw error;
  }
}

export async function joinSession(surfSession) {
  const user = Parse.User.current();
  return createUserSession(user, surfSession);
}

export async function unjoinSession(surfSession) {
  const user = Parse.User.current();
  return deleteUserSession(user, surfSession);
}
