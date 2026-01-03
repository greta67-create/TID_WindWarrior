import { unjoinSession } from "../services/usersessionService";

/**
 * Helper for ProfileView to unjoin a session and remove it
 * from the joinedSessions list so it disappears from
 * both planned and past sections.
 */
export async function unjoinAndRemoveFromJoinedList(sessionId, setJoinedSessions, e) {
  if (e?.preventDefault) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Optimistic UI update - remove from list immediately
  setJoinedSessions((prev) => prev.filter((s) => s.id !== sessionId));

  try {
    await unjoinSession(sessionId);
    console.log("Unjoined session from ProfileView:", sessionId);
  } catch (err) {
    console.error("Error unjoining session from ProfileView:", err);
    // Note: We don't revert here since we'd need to refetch from server
    // The session is already removed from UI, which is acceptable UX
  }
}
