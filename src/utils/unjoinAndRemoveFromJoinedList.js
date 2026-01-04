import { unjoinSession } from "../services/usersessionService";

/**
 * Helper for ProfileView to unjoin a session and remove it
 * from the joinedSessions list so it disappears from
 * both planned and past sections.
 */
export async function unjoinAndRemoveFromJoinedList(sessionId, setJoinedSessions) {
  setJoinedSessions((prev) => prev.filter((s) => s.id !== sessionId));

  try {
    await unjoinSession(sessionId);
    console.log("Unjoined session from ProfileView:", sessionId);
  } catch (err) {
    console.error("Error unjoining session from ProfileView:", err);
  }
}
