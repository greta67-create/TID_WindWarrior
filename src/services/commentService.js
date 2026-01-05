import Parse from "../parse-init";
/**
 * Service layer for Comment operations
 */

// Define comment Parse class
const Comment = Parse.Object.extend("comment");

//Create a session pointer for queries and saving
function createSessionPointer(surfSessionId) {
  const pointer = new Parse.Object("SurfSessions");
  pointer.id = surfSessionId;
  return pointer;
}

//Create a spot pointer for queries and saving
function createSpotPointer(spotId) {
  const pointer = new Parse.Object("Spot");
  pointer.id = spotId;
  return pointer;
}

/**
 * Convert a Parse comment object to a plain JavaScript object  
 * @param {Parse.Object} parseObj - The Parse object to convert
 * @returns {Object} Plain JavaScript object with comment data
 */
export function commentToPlainObject(parseObj) {
    if (!parseObj) {
        console.error("commentToPlainObject: parseObj is null or undefined");
        return null;
    }

    const user = parseObj.get("userId");
    const firstName = user?.get("firstName");
    const username = user?.get("username");
    
    return {
        id: parseObj.id,
        name: firstName || username || "Unknown user",
        user_id: user?.id,
        time: parseObj.createdAt ? parseObj.createdAt.toLocaleString() : "Unknown time",
        message: parseObj.get("message") || "",
        mother_comment_id: parseObj.get("mother_comment_id") || null,
    };
}

/**
 * Fetch comments for a given session
 * @param {string} surfSessionId - The ID of the session to fetch comments for
 * @returns {Promise<Array>} Array of plain JavaScript objects with comment data
 */
export async function fetchSessionComments(surfSessionId) {
    if (!surfSessionId) {
      throw new Error("Session ID must be provided to fetch session comments");
    }
  
    const query = new Parse.Query(Comment);
    const sessionPointer = createSessionPointer(surfSessionId);
  
    query.equalTo("surfSessionId", sessionPointer); // filter comments by session
    query.include("userId");
    query.ascending("createdAt");
  
    try {
      const results = await query.find();
      return results.map(commentToPlainObject);
    } catch (error) {
      console.error("Error fetching session comments:", error);
      throw error;
    }
}


/**
 * Fetch comments for a given spot
 * @param {string} spotId - The ID of the spot to fetch comments for
 * @returns {Promise<Array>} Array of plain JavaScript objects with comment data
 */
export async function fetchSpotComments(spotId) {
    if (!spotId) {
      throw new Error("Spot ID must be provided to fetch spot comments");
    }

    const query = new Parse.Query(Comment);
    const spotPointer = createSpotPointer(spotId);

    query.equalTo("spotId", spotPointer); // filter comments by spot
    query.ascending("createdAt");
    query.include("userId");
  
    try {
      const results = await query.find();
      return results.map(commentToPlainObject);
    } catch (error) {
      console.error("Error fetching comments for Spot:", error);
      throw error;
    }
}

/**
 * Create a new comment
 * @param {string} surfSessionId - The ID of the session to create the comment for
 * @param {string} spotId - The ID of the spot to create the comment for
 * @param {Parse.User} userId - The user who creates the comment
 * @param {string} message - The message of the comment
 * @param {string} mother_comment_id - The ID of the mother comment
 */
export async function createComment(surfSessionId  = null, spotId = null, userId, message, mother_comment_id = null) {
    const comment = new Comment();
    comment.set("userId", userId);
    comment.set("message", message);

    // set the session or spot pointer 
    if (surfSessionId) {
        const sessionPointer = createSessionPointer(surfSessionId);
        comment.set("surfSessionId", sessionPointer);
    }
    if (spotId) {
        const spotPointer = createSpotPointer(spotId);
        comment.set("spotId", spotPointer);
    }
    if (mother_comment_id) {
        comment.set("mother_comment_id", mother_comment_id);
    }
    try {
        const savedComment = await comment.save();
        return commentToPlainObject(savedComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
}

/**
 * Delete a comment from the backend
 * @param {string} id - The ID of the comment to delete
 * @returns {Promise<boolean>} True if the comment was deleted, false otherwise
 */
export async function deleteComment(id) {
  if (!id) {
    throw new Error("Comment ID must be provided to delete a comment");
  }

  try {
    // Get the current user
    const currentUser = Parse.User.current();
    if (!currentUser) {
      throw new Error("User must be logged in to delete comments");
    }

    // Fetch the comment to check ownership
    const query = new Parse.Query(Comment);
    const commentToDelete = await query.get(id);
    
    // Check ownership - compare user IDs (client-side validation)
    const commentUserId = commentToDelete.get("userId");
    if (!commentUserId || commentUserId.id !== currentUser.id) {
      console.error("deleteComment: not authorized to delete comment");
      return false;
    }

    // Delete the comment
    await commentToDelete.destroy();
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}    