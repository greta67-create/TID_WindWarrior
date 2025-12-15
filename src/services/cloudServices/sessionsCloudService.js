// This file is just a replica of the Cloud Service function on Back4App for reference
// It is therefore not importet anywhere in the app

// @team please update if you change the function on Back4App

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
    
    if (filters.sessionIds?.length) {
    const sessionPtrs = filters.sessionIds.map((id) => ({ __type: 'Pointer', className: 'SurfSessions', objectId: id }));
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

    const userSessionsQuery = new Parse.Query("UserSessions");

    // Filter by current user and fetch related data
    userSessionsQuery.equalTo("userId", user);
    userSessionsQuery.include("surfSessionId");
    userSessionsQuery.include("surfSessionId.spotId");
    
    // Only query UserSessions for the session IDs we already retrieved
    if (sessionResults.length > 0) {
      const sessionPointers = sessionResults.map(session => ({
        __type: 'Pointer',
        className: 'SurfSessions',
        objectId: session.id
      }));
      userSessionsQuery.containedIn("surfSessionId", sessionPointers);
    }

    const userSessionsData = await userSessionsQuery.find();
    
    // For each UserSessions row, take its sessionId and convert to plain object
    const userSessionIDs = userSessionsData.map((userSession) => {
      return userSession.get("surfSessionId").id;
    });
    console.log("User sessions data:", userSessionIDs);
    console.log("sessionResults:", sessionResults);

    // add isJoined flag to sessions
    sessionResults = sessionResults.map((session) => {
      return {
        ...session,
        isJoined: userSessionIDs.includes(session.id),
      };
    });

    // add isJoined flag to sessions
    sessionResults = sessionResults.map((session) => {
      return {
        ...session,
        isJoined: userSessionIDs.includes(session.id),
      };
    });
    // filter only wants joined sessions  for Profileview
    if (filters.joinedOnly) {
      sessionResults = sessionResults.filter((session) => session.isJoined);
    }
    
    return sessionResults;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    throw error;
  }
});