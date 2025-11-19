import Parse from "parse";
import { commentToPlainObject } from "./commentService";


/**
 * Service layer for Spot operations
 */

// Define the spot Parse class
const spot = Parse.Object.extend("Spot");

/**
 * Convert a Parse spot object to a plain JavaScript object
 * @param {Parse.Object} parseObj - The Parse object to convert
 * @returns {Object} Plain JavaScript object with todo data
 */
function spotToPlainObject(parseObj) {
  return {
    id: parseObj.id,
    name: parseObj.get("spotName"),
    latitude: parseObj.get("latitude"),
    longitude: parseObj.get("longitude"),
    currentWindDirection: parseObj.get("currentWindDirection"),
    currentWindKnts: parseObj.get("currentWindKnts"),
    mainText: parseObj.get("mainText"),
    createdAt: parseObj.get("createdAt"),
    updatedAt: parseObj.get("updatedAt"),
  };
}

/**
 * Fetch all spots for a specific category for the current user
 * @param {string} category - The category to filter by
 * @returns {Promise<Array>} Array of spots as plain objects
 */
export async function fetchSpots() {
    const query = new Parse.Query(spot);
    // Oldest first

    try {
        const results = await query.find();
        return results.map(spotToPlainObject);
    } catch (error) {
        console.error("Error fetching Spots:", error);
        throw error;
    }
}

export async function fetchSpotByName(spotName) {
    const query = new Parse.Query(spot);
    try {
        const result = await query.equalTo("spotName", spotName).first();
        return spotToPlainObject(result);
    } catch (error) {
        console.error("Error fetching Spot by name:", error);
        throw error;
    }
}


export async function fetchCommentsToSpotId(spotId) {
    const Comment = Parse.Object.extend("comment");
    const query = new Parse.Query(Comment);
    const spotPointer = new Parse.Object("Spot");
    spotPointer.id = spotId;
    query.equalTo("spotId", spotPointer);
    query.ascending("createdAt");
    query.include("userId");

    console.log("Fetching Comments for Spot ID:", spotId);

    try {
        const results = await query.find();
        console.log("Fetched Comments:", results);
        return results.map(commentToPlainObject);
    } catch (error) {
        console.error("Error fetching comments for Spot:", error);
        throw error;
    }
}


// move to sessionsService.js later?
async function loadUpcomingUserSessions(user) {
    try {
         // Query the UserSessions table
        const userSessionsQuery = new Parse.Query('UserSessions');
        // Filter by current user
        userSessionsQuery.equalTo('userId', user);
        userSessionsQuery.include('sessionId');
        // userSessionsQuery.filter('sessionId.sessionDateTime', '>=', new Date());

        const userSessions = await userSessionsQuery.find();
        
        const to_return =userSessions.map(commentObj => ({
            id: commentObj.id,
            sessionId: commentObj.get('sessionId').id,
        }));
        console.log(to_return);
        return to_return;
    } catch (error) {
        console.error("Error fetching user sessions:", error);
    }

};

export async function fetchUpcomingSessionsToSpotId(spotId) {
    const session = Parse.Object.extend("Session_");
    const query = new Parse.Query(session);
    query.include("spotId.spotName");
    query.equalTo('spotId', {
      __type: 'Pointer',
      className: 'Spot',
      objectId: spotId
    });



    console.log("Fetching Sessions for Spot ID:", spotId);

    try {
        const results = await query.find();
        console.log("Fetched Sessions:", results);

        const upcoming_sessions = results.map(sessionObj => ({
            id: sessionObj.id,
            spotName: sessionObj.get("spotId").get("spotName"),
            sessionDateTime: sessionObj.get("sessionDateTime"),
            timeLabel: sessionObj.get("sessionDateTime").toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "2-digit",
              }),
            dateLabel: sessionObj.get("sessionDateTime").toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
              }),
            durationHours: sessionObj.get("durationHours"),
            windPower: sessionObj.get("windPower"),
            windDirection: sessionObj.get("windDirection"),
            weatherType: sessionObj.get("weatherType"),
            temperature: sessionObj.get("temperature"),
            createdAt: sessionObj.get("createdAt"),
            updatedAt: sessionObj.get("updatedAt"),
        }));

        const upcoming_user_sessions = await loadUpcomingUserSessions(Parse.User.current());
        console.log("Fetched User Sessions:", upcoming_user_sessions);
        //mtch upcoming sessions with user sessions to mark joined with isJoined = True
        const upcoming_sessions_with_joined = upcoming_sessions.map(session => {
            const isJoined = upcoming_user_sessions.some(user_session => user_session.sessionId === session.id);
            return {
                ...session,
                isJoined,
            };
        });

        return upcoming_sessions_with_joined;
    } catch (error) {
        console.error("Error fetching Sessions for Spot:", error);
        throw error;
    }
}