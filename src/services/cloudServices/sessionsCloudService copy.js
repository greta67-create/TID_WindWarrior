// This file is a replica of the Cloud Service function on Back4App for reference
// It is not imported anywhere in the app
// @team: Please update this file if you change the function on Back4App

/**
 * Converts a Parse SurfSessions object to a plain JavaScript object
 * @param {Parse.Object} parseObj - The Parse session object to convert
 * @returns {Object} Plain JavaScript object with session data
 */

function sessionToPlainObject(parseObj) {
  const spotObj = parseObj.get("spotId");
  const date = parseObj.get("sessionDateTime"); 

  let dateLabel = "-";
  let timeLabel = "-";


  if (date) {
  dateLabel = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  timeLabel = date.toLocaleTimeString([], {
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
    isJoined: false, // default value; will be updated later
  };
}

Parse.Cloud.define("loadSessions", async (request) => {
  try {
    const user = request.user;
    const filters = request.params.filters || {};
    
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const Session = Parse.Object.extend("SurfSessions");
    const query = new Parse.Query(Session);
    query.include("spotId");
    
    // Apply filters to query
    if (filters.futureOnly) {
      query.greaterThanOrEqualTo("sessionDateTime", new Date());
    }

    if (filters.sessionIds && filters.sessionIds.length > 0) {
    query.containedIn("objectId", filters.sessionIds);
    }
    
    if (filters.spotIds && filters.spotIds.length > 0) {
      const spotPointers = filters.spotIds.map(spotId => ({
        __type: 'Pointer',
        className: 'Spot',
        objectId: spotId
      }));
      query.containedIn("spotId", spotPointers);
    }
    
    let sessionResults = await query.find();
    console.log("sessionResults:", sessionResults);

    sessionResults = sessionResults.map((session) => sessionToPlainObject(session));

    // Query to get current user's joined sessions (for isJoined flag)
    const currentUserSessionsQuery = new Parse.Query("UserSessions");
    currentUserSessionsQuery.equalTo("userId", user);
    currentUserSessionsQuery.include("surfSessionId");
    currentUserSessionsQuery.include("surfSessionId.spotId");
    
    // Only query UserSessions for the session IDs we already retrieved
    if (sessionResults.length > 0) {
      const sessionPointers = sessionResults.map(session => ({
        __type: 'Pointer',
        className: 'SurfSessions',
        objectId: session.id
      }));
      currentUserSessionsQuery.containedIn("surfSessionId", sessionPointers);
    }

    const currentUserSessionsData = await currentUserSessionsQuery.find();
    
    // Get IDs of sessions the current user has joined
    const userSessionIDs = currentUserSessionsData.map((userSession) => {
      const surfSession = userSession.get("surfSessionId");
      return surfSession ? surfSession.id : null;
    })
      .filter(id => id !== null); 
  

    // Query to get ALL UserSessions for all sessions (to get joined users and count)
    const allUserSessionsQuery = new Parse.Query("UserSessions");
    allUserSessionsQuery.include("userId"); // Include user data
    allUserSessionsQuery.include("surfSessionId");
    
    if (sessionResults.length > 0) {
      const sessionPointers = sessionResults.map(session => ({
        __type: 'Pointer',
        className: 'SurfSessions',
        objectId: session.id
      }));
      allUserSessionsQuery.containedIn("surfSessionId", sessionPointers);
    }

    const allUserSessionsData = await allUserSessionsQuery.find();
    
    // Group UserSessions by sessionId and extract user info
    const joinedUsersBySession = {};
    allUserSessionsData.forEach((userSession) => {
      const surfSession = userSession.get("surfSessionId");
      const userObj = userSession.get("userId");
    
      // Skip if either is null
      if (!surfSession || !userObj) return;
    
      const sessionId = surfSession.id;
      
      if (!joinedUsersBySession[sessionId]) {
        joinedUsersBySession[sessionId] = [];
      }
      
      // Extract user profile picture
      const profilePicture = userObj.get("profilepicture");
      const avatarUrl = profilePicture && typeof profilePicture.url === "function" 
        ? profilePicture.url() 
        : null;
      
      joinedUsersBySession[sessionId].push({
        id: userObj.id,
        avatar: avatarUrl,
      });
    });

    // add isJoined flag, joinedCount, and joinedUsers to sessions
    // Only return first 3 avatars for performance, but keep total count
    sessionResults = sessionResults.map((session) => {
      const allJoinedUsers = joinedUsersBySession[session.id] || [];
      const totalCount = allJoinedUsers.length;
      // Only return first 3 avatars
      const firstThreeAvatars = allJoinedUsers.slice(0, 3);
      return {
        ...session,
        isJoined: userSessionIDs.includes(session.id),
        joinedCount: totalCount,
        joinedUsers: firstThreeAvatars,
      };
    });
    
    return sessionResults;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    throw error;
  }
});








/////////////////////////////////////////////////////////////

// helper function sesstionToPlainObject
function sessionToPlainObject(parseObj) {
  const spotObj = parseObj.get("spotId");
  const date = parseObj.get("sessionDateTime");

  let dateLabel = "-";
  let timeLabel = "-";

  if (date) {
    dateLabel = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    timeLabel = date.toLocaleTimeString([], {
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
    isJoined: false,
  };
}

// Cloud function setup
Parse.Cloud.define("loadSessions", async (request) => {
  try {
    const user = request.user;
    const filters = request.params.filters || {};

    if (!user) {
      throw new Error("User must be authenticated");
    }

    const Session = Parse.Object.extend("SurfSessions");
    const query = new Parse.Query(Session);
    query.include("spotId");

    // Apply filters to query
    // for Feedview
    if (filters.futureOnly) {
      query.greaterThanOrEqualTo("sessionDateTime", new Date());
    }

    //for Sessionview
    if (filters.sessionIds && filters.sessionIds.length > 0) {
      query.containedIn("objectId", filters.sessionIds);
    }

    //for Spotview
    if (filters.spotIds && filters.spotIds.length > 0) {
      const spotPointers = filters.spotIds.map((spotId) => ({
        __type: "Pointer",
        className: "Spot",
        objectId: spotId,
      }));
      query.containedIn("spotId", spotPointers);
    }

    let sessionResults = await query.find();
    console.log("sessionResults:", sessionResults);

    sessionResults = sessionResults.map((session) =>
      sessionToPlainObject(session)
    );

    // Query to get current user's joined sessions (for isJoined flag)
    const currentUserSessionsQuery = new Parse.Query("UserSessions");
    currentUserSessionsQuery.equalTo("userId", user);
    currentUserSessionsQuery.include("surfSessionId");
    currentUserSessionsQuery.include("surfSessionId.spotId");

    // Only query UserSessions for the session IDs we already retrieved
    if (sessionResults.length > 0) {
      const sessionPointers = sessionResults.map((session) => ({
        __type: "Pointer",
        className: "SurfSessions",
        objectId: session.id,
      }));
      currentUserSessionsQuery.containedIn("surfSessionId", sessionPointers);
    }

    const currentUserSessionsData = await currentUserSessionsQuery.find();

    // Get IDs of sessions the current user has joined
    const userSessionIDs = currentUserSessionsData
      .map((userSession) => {
        const surfSession = userSession.get("surfSessionId");
        return surfSession ? surfSession.id : null;
      })
      .filter((id) => id !== null);

    // Query to get ALL UserSessions for all sessions (to get joined users and count)
    const allUserSessionsQuery = new Parse.Query("UserSessions");
    allUserSessionsQuery.include("userId"); // Include user data
    allUserSessionsQuery.include("surfSessionId");

    if (sessionResults.length > 0) {
      const sessionPointers = sessionResults.map((session) => ({
        __type: "Pointer",
        className: "SurfSessions",
        objectId: session.id,
      }));
      allUserSessionsQuery.containedIn("surfSessionId", sessionPointers);
    }

    const allUserSessionsData = await allUserSessionsQuery.find();

    // Group UserSessions by sessionId and extract user info
    const joinedUsersBySession = {};
    allUserSessionsData.forEach((userSession) => {
      const surfSession = userSession.get("surfSessionId");
      const userObj = userSession.get("userId");

      // Skip if either is null
      if (!surfSession || !userObj) return;

      const sessionId = surfSession.id;

      if (!joinedUsersBySession[sessionId]) {
        joinedUsersBySession[sessionId] = [];
      }

      // Extract user avatar URL from profilepicture Parse File
      const file = userObj.get("profilepicture");
      const avatarUrl =
        file && typeof file.url === "function" ? file.url() : null;

      joinedUsersBySession[sessionId].push({
        id: userObj.id,
        avatar: avatarUrl,
      });
    });

    // add isJoined flag, joinedCount, and joinedUsers to sessions
    // Only return first 3 avatars for performance, but keep total count
    sessionResults = sessionResults.map((session) => {
      const allJoinedUsers = joinedUsersBySession[session.id] || [];
      const totalCount = allJoinedUsers.length;
      // Only return first 3 avatars
      const firstThreeAvatars = allJoinedUsers.slice(0, 3);
      return {
        ...session,
        isJoined: userSessionIDs.includes(session.id),
        joinedCount: totalCount,
        joinedUsers: firstThreeAvatars,
      };
    });

    return sessionResults;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    throw error;
  }
});
