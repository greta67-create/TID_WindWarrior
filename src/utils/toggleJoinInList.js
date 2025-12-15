// utils/toggleJoinInList.js
import { joinSession, unjoinSession } from "../services/usersessionService";

export async function toggleJoinInSessionList(sessionId, getSessions, setSessions) {
  const sessions = getSessions();
  const currentlyJoined = sessions.some((s) => s.id === sessionId && s.isJoined);

  // optimistic UI toggle
  setSessions((prev) =>
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
    // revert on error
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, isJoined: !s.isJoined } : s))
    );
  }
}