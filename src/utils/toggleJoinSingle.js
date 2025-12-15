// utils/toggleJoinSingle.js
import { joinSession, unjoinSession } from "../services/usersessionService";

export async function toggleJoinSingle(sessionId, isJoined, setIsJoined) {
  const currentlyJoined = isJoined;
  setIsJoined(!currentlyJoined); // optimistic

  try {
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