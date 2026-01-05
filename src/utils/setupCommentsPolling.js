import { fetchSessionComments, fetchSpotComments } from "../services/commentService";

/**
 * Sets up polling for comments
 * @param {string|null} sessionId - The session ID to fetch comments for
 * @param {string|null} spotId - The spot ID to fetch comments for
 * @param {Function} setComments - State setter for comments
 * @param {number} intervalMs - Polling interval in milliseconds (default: 10000)
 * @returns {Function} Cleanup function to clear the interval
 */
export function setupCommentsPolling(sessionId, spotId, setComments, intervalMs = 10000) {
  if (!sessionId && !spotId) {
    return () => {}; // Return no-op cleanup function
  }

  const loadComments = async () => {
    try {
      const loadedComments = sessionId
        ? await fetchSessionComments(sessionId)
        : await fetchSpotComments(spotId);
      setComments(loadedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Don't clear comments on error, keep existing ones
    }
  };

  // Load comments immediately
  loadComments();

  // Set up polling interval
  const interval = setInterval(loadComments, intervalMs);

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}

