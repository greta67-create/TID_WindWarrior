// This file is a replica of the Cloud Service function on Back4App for reference
// It is not imported anywhere in the app
// @team: Please update this file if you change the function on Back4App

/**
 * Converts a Parse SurfSessions object to a plain JavaScript object
 * @param {Parse.Object} parseObj - The Parse session object to convert
 * @returns {Object} Plain JavaScript object with session data
 */
function sessionToPlainObject(parseObj) {
  if (!parseObj) {
    console.error("sessionToPlainObject: parseObj is null or undefined");
    return null;
  }

  const spotObj = parseObj.get("spotId");
  const date = parseObj.get("sessionDateTime");

  let dateLabel = "-";
  let timeLabel = "-";

  if (date) {
    dateLabel = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    timeLabel = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return {
    id: parseObj.id,
    durationHours: parseObj.get("durationHours"),
    windPower: parseObj.get("windPower"),
    weatherType: parseObj.get("weatherType"),
    temperature: parseObj.get("temperature"),
    windDirection: parseObj.get("windDirection"),
    sessionDateTime: date,
    dateLabel,
    timeLabel,
    spotName: spotObj ? spotObj.get("spotName") : "Unknown spot",
    spotId: spotObj ? spotObj.id : null,
    coastDirection: spotObj ? spotObj.get("coastDirection") : null,
    isJoined: false, // Will be updated later with actual join status
  };
}

/**
 * Cloud function to load sessions with filters and user join information
 * Returns sessions with isJoined flag, joinedCount, and joinedUsers (avatars)
 *
 * @param {Object} request.params.filters - Filter options:
 *   - futureOnly: boolean - Only return future sessions
 *   - sessionIds: string[] - Return specific sessions by ID
 *   - spotIds: string[] - Return sessions for specific spots
 *   - joinedByCurrentUser: boolean - Only return sessions the user has joined
 * @returns {Promise<Array>} Array of session objects with join information
 */
Parse.Cloud.define("loadSessions", async (request) => {
  try {
    const user = request.user;
    const filters = request.params.filters || {};

    if (!user) {
      throw new Error("User must be authenticated");
    }

    //  Query sessions based on filters
    const Session = Parse.Object.extend("SurfSessions");
    const query = new Parse.Query(Session);
    query.include("spotId"); // Include spot data to avoid extra queries

    // If joinedByCurrentUser, get joined session IDs first to filter main query
    // only relevant for Profileview 
    let joinedSessionIds = null;
    if (filters.joinedByCurrentUser) {
      const userSessionsQuery = new Parse.Query("UserSessions");
      userSessionsQuery.equalTo("userId", user);
      userSessionsQuery.include("surfSessionId");
      const userSessionsData = await userSessionsQuery.find();

      joinedSessionIds = userSessionsData
        .map((userSession) => {
          const surfSession = userSession.get("surfSessionId");
          return surfSession ? surfSession.id : null;
        })
        .filter((id) => id !== null);

      if (joinedSessionIds.length === 0) {
        return []; // return on function level User hasn't joined any sessions therfore we don't return any sessions
      }

      query.containedIn("objectId", joinedSessionIds);
    }

    // Apply other filters
    if (filters.futureOnly) {
      query.greaterThanOrEqualTo("sessionDateTime", new Date());
    }

    // Multiple sessions filter
    if (filters.sessionIds && filters.sessionIds.length > 0) {
      query.containedIn("objectId", filters.sessionIds);
    }

    if (filters.spotIds && filters.spotIds.length > 0) {
      const spotPointers = filters.spotIds.map((spotId) => ({
        __type: "Pointer",
        className: "Spot",
        objectId: spotId,
      }));
      query.containedIn("spotId", spotPointers);
    }

    const sessionParseObjects = await query.find();

    // Convert to plain objects and filter out any null results
    let sessions = sessionParseObjects
      .map((session) => sessionToPlainObject(session))
      .filter((session) => session !== null);

    if (sessions.length === 0) {
      return [];
    }

    // Get all joined users for all sessions (single query for avatars, count, and isJoined)
    const allUserSessionsQuery = new Parse.Query("UserSessions");
    allUserSessionsQuery.include("userId"); // Include user data for avatars
    allUserSessionsQuery.include("surfSessionId");

    // filtering only for the relevant sessions
    const allSessionPointers = sessions.map((session) => ({
      __type: "Pointer",
      className: "SurfSessions",
      objectId: session.id,
    }));
    allUserSessionsQuery.containedIn("surfSessionId", allSessionPointers);

    const allUserSessionsData = await allUserSessionsQuery.find();

    // Group joined users by session ID and extract avatar URLs
    const joinedUsersBySession = {};
    allUserSessionsData.forEach((userSession) => {
      const surfSession = userSession.get("surfSessionId");
      const userObj = userSession.get("userId");

      // Skip if data is missing
      if (!surfSession || !userObj) return;

      const sessionId = surfSession.id;

      if (!joinedUsersBySession[sessionId]) {
        joinedUsersBySession[sessionId] = [];
      }

      // Extract user avatar URL from profilepicture Parse File
      const file = userObj.get("profilepicture");
      const avatarUrl = file?.url();

      joinedUsersBySession[sessionId].push({
        id: userObj.id,
        avatar: avatarUrl,
      });
    });

    // Enrich sessions with join information
    // Check isJoined by looking for current user ID in allJoinedUsers
    sessions = sessions.map((session) => {
      const allJoinedUsers = joinedUsersBySession[session.id] || [];
      const isJoined = allJoinedUsers.some((joinedUser) => joinedUser.id === user.id);
      // Prioritize users with avatars before slicing to 3
      const usersWithAvatars = allJoinedUsers.filter((u) => u.avatar);
      return {
        ...session,
        isJoined,
        joinedCount: allJoinedUsers.length,
        joinedUsers: usersWithAvatars.slice(0, 3),
      };
    });

    return sessions;
  } catch (error) {
    console.error("Error in loadSessions cloud function:", error);
    throw error;
  }
});
