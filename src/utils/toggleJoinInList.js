import { joinSession, unjoinSession } from "../services/usersessionService";

/**
 * Helper for SpotView and Feed to toggle join state for a session in a list of sessions
 */
export async function toggleJoinInSessionList(sessionId, sessions, setSurfSessions) {
  const currentlyJoined = sessions.some((s) => s.id === sessionId && s.isJoined);

  // Optimistic UI update
  setSurfSessions((prev) =>
    prev.map((s) => (s.id === sessionId ? { ...s, isJoined: !s.isJoined } : s))
  );

  try {
    if (currentlyJoined) {
      await unjoinSession(sessionId);
    } else {
      await joinSession(sessionId);
    }
  } catch (error) {
    console.error("Error toggling user session:", error);
    // Revert optimistic update on error
    setSurfSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, isJoined: !s.isJoined } : s))
    );
  }
}