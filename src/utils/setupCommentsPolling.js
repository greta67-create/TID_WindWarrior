import { fetchSessionComments, fetchSpotComments } from "../services/commentService";

/**
 * Sets up polling for comments
 * @param {string|null} sessionId - The session ID to fetch comments for
 * @param {string|null} spotId - The spot ID to fetch comments for
 * @param {Function} setComments - State setter for comments
 * @returns {Function} Cleanup function to clear the interval
 */
export function setupCommentsPolling(sessionId, spotId, setComments) {
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
      setComments([]);
    }
  };

  // Load comments immediately
  loadComments();

  // Set up polling interval (10 seconds)
  const interval = setInterval(loadComments, 10000);

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}

