// utils/unjoinAndRemoveFromJoinedList.js
import { unjoinSession } from "../services/usersessionService";

/**
 * Helper for ProfileView to unjoin a session and remove it
 * from the joinedSessions list so it disappears from
 * both planned and past sections.
 */
export async function unjoinAndRemoveFromJoinedList(sessionId, setJoinedSessions) {
  try {
    await unjoinSession(sessionId);
    console.log("Unjoined session from ProfileView:", sessionId);

    // Remove the session so it disappears from Planned/Past lists
    setJoinedSessions((prev) => prev.filter((s) => s.id !== sessionId));
  } catch (err) {
    console.error("Error unjoining session from ProfileView:", err);
  }
}


