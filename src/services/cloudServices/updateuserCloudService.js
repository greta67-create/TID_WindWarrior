// This file is a replica of the User Cloud Service function on Back4App for reference
// It is not imported anywhere in the app
// @team: Please update this file if you change the function on Back4App

// This beforeSave trigger does validation on user profile updates
Parse.Cloud.beforeSave(Parse.User, async (request) => {
  const user = request.object;
  const currentUser = request.user;

  // Only allow users to update their own profile
  if (user.existed() && (!currentUser || currentUser.id !== user.id)) {
    throw new Parse.Error(
      Parse.Error.OPERATION_FORBIDDEN,
      "Not authorized to modify this user"
    );
  }

  // Validates age if provided
  const age = user.get("age");
  if (age !== undefined && age !== null) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 110) {
      throw new Parse.Error(
        Parse.Error.VALIDATION_ERROR,
        "Age must be between 0 and 110"
      );
    }
  }

  // Validate Name
  const firstName = user.get("firstName");
  if (firstName && firstName.trim().length === 0) {
    throw new Parse.Error(Parse.Error.VALIDATION_ERROR, "Name cannot be empty");
  }
  if (firstName && firstName.length > 50) {
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      "Must be less than 50 characters"
    );
  }

  // Validate profile picture file size if provided (max 8MB)
  const profilePic = user.get("profilepicture");
  if (profilePic && profilePic._source && profilePic._source.file) {
    const fileSize = profilePic._source.file.size;
    const maxSize = 8 * 1024 * 1024; // 8MB in bytes
    if (fileSize > maxSize) {
      throw new Parse.Error(
        Parse.Error.FILE_SAVE_ERROR,
        "Profile picture must be less than 8MB"
      );
    }
  }
});
