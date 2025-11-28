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

export async function deleteComment(id) {
// Create a new Todo parse object instance and set todo id
  const comment = new Comment();
  comment.set('objectId', id);
// .destroy should be called to delete a parse object
  try {
    await comment.destroy();
    alert('Success! To-do deleted!');
    // Refresh to-dos list to remove this one
	    return true;
    } catch (error) {
	    // Error can be caused by lack of Internet connection
	    alert(`Error! ${error.message}`);
	    return false;
    };
};    