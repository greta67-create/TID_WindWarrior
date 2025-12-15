import Parse from "../parse-init";
import { commentToPlainObject } from "./commentService";

// Service layer for SurfSessions operations
const Session = Parse.Object.extend("SurfSessions");
const Comment = Parse.Object.extend("comment");

/**
 * Convert a Parse SurfSessions object to a plain JavaScript object
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