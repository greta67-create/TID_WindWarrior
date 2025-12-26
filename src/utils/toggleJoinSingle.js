// utils/toggleJoinSingle.js
import { joinSession, unjoinSession } from "../services/usersessionService";

/**
 * Helper for SessionView to toggle join state for a single session
 */
export async function toggleJoinSingle(sessionId, isJoined, setIsJoined) {
  const currentlyJoined = isJoined;
  setIsJoined(!currentlyJoined); // optimistic UI update

  try {
    // if currently joined, unjoin session, otherwise join session
    if (currentlyJoined) {
      await unjoinSession(sessionId);
    } else {
      await joinSession(sessionId);
    }
  } catch (error) {
    console.error("Error toggling join state:", error);
    setIsJoined(currentlyJoined); // revert on error
  }
}