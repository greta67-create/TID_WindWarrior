import Parse from "parse";

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
    activities: parseObj.get("activities"),           
    skillLevel: parseObj.get("skillLevel"),           
    amenities: parseObj.get("amenities"),             
    spotImage: parseObj.get("spotImage"), 
    windfinderLink: parseObj.get("windfinderLink"),            
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

