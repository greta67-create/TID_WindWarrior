import Parse from "parse";
/**
 * Service layer for Comment operations
 */


const Comment = Parse.Object.extend("comment");


export function commentToPlainObject(parseObj) {
    const user = parseObj.get("userId");
    return {
        id: parseObj.id,
        name:
        (user && (user.get("firstName") || user.get("username"))) || "Unknown user",
        user_id: user && user.id,
        time: parseObj.createdAt.toLocaleString(),
        text: parseObj.get("message"),
        mother_comment_id: parseObj.get("mother_comment_id"),
    };
}

export async function fetchSessionComments(surfSessionId) {
    if (!surfSessionId) {
      throw new Error("Session ID missing");
    }
  
    const query = new Parse.Query(Comment);
    const sessionPointer = new Parse.Object("SurfSessions");
    sessionPointer.id = surfSessionId;
  
    query.equalTo("surfSessionId", sessionPointer);
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


  export async function fetchCommentsToSpotId(spotId) {
    const Comment = Parse.Object.extend("comment");
    const query = new Parse.Query(Comment);
    const spotPointer = new Parse.Object("Spot");
    spotPointer.id = spotId;
    query.equalTo("spotId", spotPointer);
    query.ascending("createdAt");
    query.include("userId");
  
    console.log("Fetching Comments for Spot ID:", spotId);
  
    try {
      const results = await query.find();
      console.log("Fetched Comments:", results);
      return results.map(commentToPlainObject);
    } catch (error) {
      console.error("Error fetching comments for Spot:", error);
      throw error;
    }
  }

export async function createComment(surfSessionId  = null, spotId = null, userId, message, mother_comment_id = null) {
    const comment = new Comment();
    comment.set("userId", userId);
    comment.set("message", message);
    if (surfSessionId) {
        const sessionPointer = {
            __type: 'Pointer',
            className: 'SurfSessions',
            objectId: surfSessionId
        };
        comment.set("surfSessionId", sessionPointer);
    }
    if (spotId) {
        const spotPointer = {
            __type: 'Pointer',
            className: 'Spot',
            objectId: spotId
        };
        comment.set("spotId", spotPointer);
    }
    if (mother_comment_id) {
        comment.set("mother_comment_id", mother_comment_id);
    }
    try {
        const savedComment = await comment.save();
        console.log("Created LALLA:", savedComment);
        return commentToPlainObject(savedComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
}

export async function deleteComment(id, target) {
// Create a new Todo parse object instance and set todo id
  const comment = new Comment();
  comment.set('objectId', id);
  comment.set('target', target);
  try {
    await comment.destroy();
    return true;
    } catch (error) {
    console.error("Error deleting comment:", error);
    return false;};
};    