// This file is a replica of the Comments Cloud Service function on Back4App for reference
// It is not imported anywhere in the app
// @team: Please update this file if you change the function on Back4App
  Parse.Cloud.beforeSave("comment", async (request) => {
    const message = request.object.get("message");
    const user = request.user;
    
    if (!user) {
      throw new Parse.Error("User must be authenticated to create comments");
    }
    
    // set ACL on new comments
    if (!request.object.existed()) {
      const newacl = new Parse.ACL();
      newacl.setPublicReadAccess(true);     
      newacl.setWriteAccess(user, true);    
      request.object.setACL(newacl);
    }
    
    // ensure unmeaningful comments are not shared
    if (!message || message.trim().length < 3) {
      throw new Parse.Error("Comment must be at least 3 characters");
    }
    
    if (message.length > 1000) {
      throw new Parse.Error("Comment must be less than 1000 characters");
    }
    
    // check per user from last hour on how many comments they have made
    const Comment = Parse.Object.extend("comment");
    const query = new Parse.Query(Comment);
    query.equalTo("userId", user); 
    query.greaterThan("createdAt", new Date(Date.now() - 3600000)); // last hour (3600000 miliseconds)
    
    const recentCommentCount = await query.count();
    
    if (recentCommentCount >= 10) {
      throw new Parse.Error("Rate limit exceeded. Please try again later.");
    }
    console.log("Comment validation passed");
  });