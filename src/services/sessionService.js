import Parse from "../parse-init";
import { commentToPlainObject } from "./commentService";

// Service layer for Session_ operations
const Session = Parse.Object.extend("Session_");
const Comment = Parse.Object.extend("comment");

/**
 * Convert a Parse Session_ object to a plain JavaScript object
 * @param {Parse.Object} parseObj - The Parse object to convert
 * @returns {Object} Plain JavaScript object with session data
 */

export default function sessionToPlainObject(parseObj) {
  const spotObj = parseObj.get("spotId");
  const date = parseObj.get("sessionDateTime"); // JS Date

  let dateLabel = "-";
  let timeLabel = "-";

  if (date) {
    timeLabel = date.toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
    });

    dateLabel = date.toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
    });
  }

  return {
    // IDs
    id: parseObj.id,

    // Session info
    durationHours: parseObj.get("durationHours"),
    windPower: parseObj.get("windPower"),
    weatherType: parseObj.get("weatherType"),
    temperature: parseObj.get("temperature"),
    windDirection: parseObj.get("windDirection"),
    sessionDateTime: date,
    dateLabel,
    timeLabel,

    // Spot info
    spotName: spotObj ? spotObj.get("spotName") : "Unknown spot",
    spotId: spotObj ? spotObj.id : null,
    coastDirection: spotObj ? spotObj.get("coastDirection") : null,
  };
}

/**
 * Fetch all sessions from the Parse backend
 * @returns {Promise<Array>} Array of sessions as plain JS objects
 */
export async function fetchAllSessions() {
  const query = new Parse.Query(Session);

  // fetch the related Spot object for Spot name
  query.include("spotId");
  query.ascending("sessionDateTime");

  try {
    const results = await query.find();
    return results.map(sessionToPlainObject);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw error;
  }
}

/**
 * Fetch a single session by its objectId
 * @param {string} id - The Parse objectId
 * @returns {Promise<Object>} Session as a plain JS object
 */
export async function fetchSessionById(id) {
  const query = new Parse.Query(Session);

  // also include spot for consistency
  query.include("spotId");

  try {
    const result = await query.get(id);
    return sessionToPlainObject(result);
  } catch (error) {
    console.error("Error fetching session by id:", error);
    throw error;
  }
}

// /**
//  * Fetch all sessions for a given user from the UserSessions join table
//  * @param {Parse.User} user - The current logged-in user
//  * @returns {Promise<Array>} Array of sessions as plain JS objects
//  */
// export async function fetchUserSessions(user) {
//   if (!user) {
//     throw new Error("User must be provided to fetch user sessions");
//   }

//   const query = new Parse.Query(UserSessions);

//   // Filter by current user and fetch related data
//   query.equalTo("userId", user);
//   query.include("sessionId"); // include the Session_ object
//   query.include("sessionId.spotId"); // include the Spot for the session


//   try {
//     const userSessionsData = await query.find();

//     // For each UserSessions row, take its sessionId and convert to plain object
//     const sessions = userSessionsData
//       .map((userSession) => userSession.get("sessionId"))
//       .map(sessionToPlainObject);
//     return sessions;
//   } catch (error) {
//     console.error("Error fetching user sessions:", error);
//     throw error;
//   }
// }

export async function fetchSessionComments(sessionId) {
  if (!sessionId) {
    throw new Error("Session ID missing");
  }

  const query = new Parse.Query(Comment);
  const sessionPointer = new Parse.Object("Session_");
  sessionPointer.id = sessionId;

  query.equalTo("sessionId", sessionPointer);
  query.include("userId");
  query.ascending("createdAt");

  try {
    const results = await query.find();
    return results.map(commentToPlainObject);
  } catch (error) {
    console.error("Error fetching session comments:", error);
    throw error;
  }
}
