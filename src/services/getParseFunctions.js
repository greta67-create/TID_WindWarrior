// Use this function to get data from Parse Server
// pass a query as an argument i.e for Spots let query = new Parse.Query('Spot');
import Parse from "../parse-init";

export const getList = async (query) => {
  query.include();
  let queryResult = await query.find();
  let jsonObject = queryResult.map((obj) => {
    return obj.toJSON();
  }); // Available
  console.log(jsonObject);
  return jsonObject;
};

export const getByID = async (query, id) => {
  query.include();
  let queryResult = await query.find(id);
  let jsonObject = queryResult.toJSON(); // Available
  console.log(jsonObject);
  return jsonObject;
};

export const loadUserSessions = async (user) => {
  try {
    // Query the UserSessions table
    const userSessionsQuery = new Parse.Query("UserSessions");
    // Filter by current user and fetch realted data
    userSessionsQuery.equalTo("userId", user);
    userSessionsQuery.include("sessionId");
    userSessionsQuery.include("sessionId.spotId");
    // execute query
    const userSessionsData = await userSessionsQuery.find();

    const sessions = userSessionsData
      .map((userSession) => userSession.get("sessionId"))
      .map((session) => session.toJSON());
    console.log(sessions);
    return sessions;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
  }
};



function sessionToPlainObject(parseObj) {
  const spotObj = parseObj.get("spotId");
  const date = parseObj.get("sessionDateTime"); // this is already a JS Date

  let dateLabel = "-";
  let timeLabel = "-";

  if (date) {
    dateLabel = date.toLocaleDateString();
    timeLabel = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return {
    // IDs
    id: parseObj.id, // use this everywhere in the UI

    // Session info from your backend
    durationHours: parseObj.get("durationHours"),
    windPower: parseObj.get("windPower"),
    weatherType: parseObj.get("weatherType"),
    temperature: parseObj.get("temperature"),
    windDirection: parseObj.get("windDirection"),
    sessionDateTime: date,

    // Spot info (string + ids)
    spotName: spotObj ? spotObj.get("spotName") : "Unknown spot",
    spotId: spotObj ? spotObj.id : null,
    isJoined: false, // default value; will be updated later
    
  };
}

export const loadSessions = async (user, filters = {}) => {
  try {
    const Session = Parse.Object.extend("Session_");
    const query = new Parse.Query(Session);
    
    // Apply filters to query
    if (filters.futureOnly) {
      query.greaterThanOrEqualTo("sessionDateTime", new Date());
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
    
    // Fetch joined sessions for the user
    if (!user) {
      throw new Error("User must be provided to fetch user sessions");
    }

    const userSessionsQuery = new Parse.Query("UserSessions");

    // Filter by current user and fetch related data
    userSessionsQuery.equalTo("userId", user);
    userSessionsQuery.include("sessionId"); // include the Session_ object
    userSessionsQuery.include("sessionId.spotId"); // include the Spot for the session
    
    // If filtering for future sessions, only get UserSessions created after earliest session
    if (sessionResults.length > 0) {
      const sessionPointers = sessionResults.map(session => ({
        __type: 'Pointer',
        className: 'Session_',
        objectId: session.id
      }));
      userSessionsQuery.containedIn("sessionId", sessionPointers);
    }

    const userSessionsData = await userSessionsQuery.find();
    
    // For each UserSessions row, take its sessionId and convert to plain object
    const userSessionIDs = userSessionsData.map((userSession) => {
      return userSession.get("sessionId").id;
    })
    console.log("User sessions data:", userSessionIDs);
    console.log("sessionResults:", sessionResults);

    // add isJoined flag to sessions
    sessionResults = sessionResults.map((session) => {
      return {
        ...session,
        isJoined: userSessionIDs.includes(session.id),
      };
    });
    
    return sessionResults;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    throw error;
  }
};

