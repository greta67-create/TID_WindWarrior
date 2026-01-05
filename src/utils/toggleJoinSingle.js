import { joinSession, unjoinSession } from "../services/usersessionService";
import { addCurrentUserToSession, removeCurrentUserFromSession } from "./updateSessionAvatars";

/**
 * Helper for SessionView to toggle join state for a single session
 * Updates the entire session object including avatars
 */
export async function toggleJoinSingle(session, setSession) {
  if (!session) return;

  const currentlyJoined = session.isJoined;

  // UI update with avatar changes
  setSession((prev) =>
    currentlyJoined
      ? { ...removeCurrentUserFromSession(prev), isJoined: false }
      : { ...addCurrentUserToSession(prev), isJoined: true }
  );

  // if currently joined, unjoin session, otherwise join session
  try {
    if (currentlyJoined) {
      await unjoinSession(session.id);
    } else {
      await joinSession(session.id);
    }
  } catch (error) {
    console.error("Error toggling join state:", error);
    // revert on error (optimistic UI update)
    setSession((prev) =>
      currentlyJoined
        ? { ...addCurrentUserToSession(prev), isJoined: true }
        : { ...removeCurrentUserFromSession(prev), isJoined: false }
    );
  }
}
