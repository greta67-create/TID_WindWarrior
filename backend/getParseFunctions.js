// Use this function to get data from Parse Server
// pass a query as an argument i.e for Spots let query = new Parse.Query('Spot');
import Parse from "../src/parse-init";

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
