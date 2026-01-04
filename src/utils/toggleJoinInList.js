import { joinSession, unjoinSession } from "../services/usersessionService";
import { addCurrentUserToSession, removeCurrentUserFromSession } from "./updateSessionAvatars";

/**
 * Helper for SpotView and Feed to toggle join state for a session in a list
 * Updates isJoined flag AND avatars/count for real-time display
 */
export async function toggleJoinInSessionList(sessionId, sessions, setSessions) {
  const currentlyJoined = sessions.some((s) => s.id === sessionId && s.isJoined);

  // UI update with avatar changes
  setSessions((prev) =>
    prev.map((s) => {
      if (s.id !== sessionId) return s;
      return currentlyJoined
        ? { ...removeCurrentUserFromSession(s), isJoined: false }
        : { ...addCurrentUserToSession(s), isJoined: true };
    })
  );

  try {
    if (currentlyJoined) {
      await unjoinSession(sessionId);
    } else {
      await joinSession(sessionId);
    }
  } catch (error) {
    console.error("Error toggling user session:", error);
    
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return currentlyJoined
          ? { ...addCurrentUserToSession(s), isJoined: true }
          : { ...removeCurrentUserFromSession(s), isJoined: false };
      })
    );
  }
}
