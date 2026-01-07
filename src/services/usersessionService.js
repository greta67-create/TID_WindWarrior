import Parse from "../parse-init";

const UserSessions = Parse.Object.extend("UserSessions");

/**
 * Create a session pointer for querying
 */
function createSessionPointer(surfSessionId) {
  const pointer = new Parse.Object("SurfSessions");
  pointer.id = surfSessionId;
  return pointer;
}

/**
 * Create a UserSessions entry for a given user and session
 * @param {Parse.User} user - The logged-in user
 * @param {string} surfSessionId - The objectId of the SurfSessions
 * @returns {Promise<Parse.Object>} The created or existing UserSessions object
 */
export async function createUserSession(user, surfSessionId) {
  if (!user || !surfSessionId) {
    throw new Error("User and session ID are required");
  }

  const sessionPointer = createSessionPointer(surfSessionId);

  // check if user is already joined to this session
  const query = new Parse.Query(UserSessions);
  query.equalTo("userId", user);
  query.equalTo("surfSessionId", sessionPointer);
  const existing = await query.first();
  if (existing) {
    return existing;
  }

  const userSession = new UserSessions();
  userSession.set("userId", user);
  userSession.set("surfSessionId", sessionPointer);
  return userSession.save();
}

/**
 * Delete the UserSessions entry for a given user and session
 * @param {Parse.User} user - The logged-in user
 * @param {string} surfSessionId - The objectId of the SurfSessions
 * @returns {Promise<void>}
 */
export async function deleteUserSession(user, surfSessionId) {
  if (!user || !surfSessionId) {
    throw new Error("User and session ID are required");
  }

  const sessionPointer = createSessionPointer(surfSessionId);

  // check if user is joined to this session
  const query = new Parse.Query(UserSessions);
  query.equalTo("userId", user);
  query.equalTo("surfSessionId", sessionPointer);
  
  // if user is joined to this session, delete the user session
  const userSession = await query.first();
  if (userSession) {
    await userSession.destroy();
  }
}

/**
 * Join a session 
 * @param {string} surfSessionId - The objectId of the SurfSessions
 * @returns {Promise<Parse.Object>}
 */
export async function joinSession(surfSessionId) {
  const user = Parse.User.current();
  if (!user) {
    throw new Error("User must be logged in to join a session");
  }
  return createUserSession(user, surfSessionId);
}

/**
 * Unjoin a session 
 * @param {string} surfSessionId - The objectId of the SurfSessions
 * @returns {Promise<void>}
 */
export async function unjoinSession(surfSessionId) {
  const user = Parse.User.current();
  if (!user) {
    throw new Error("User must be logged in to unjoin a session");
  }
  return deleteUserSession(user, surfSessionId);
}
