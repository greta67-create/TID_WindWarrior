import { IoPeopleOutline } from "react-icons/io5";

/**
 * Displays user avatars with count indicator
 * Shows up to 3 avatars, with a "+N" badge if there are more users
 * Shows empty state if no users joined
 * 
 * @param {Array} joinedUsers - Array of user objects with avatar property
 * @param {number} joinedCount - Total number of joined users
 */
export default function AvatarStack({ joinedUsers = [], joinedCount = 0 }) {
  // Extract avatar URLs from joinedUsers
  const userAvatars =
    joinedUsers && joinedUsers.length > 0
      ? joinedUsers.map((u) => u.avatar).filter(Boolean)
      : [];

  // Show at most 3 avatars
  const shownAvatars = userAvatars.slice(0, 3);

  if (joinedCount > 0) {
    return (
      <div className="avatar-stack">
        {shownAvatars.map((src, index) => (
          <img key={index} alt="" src={src} className="avatar" />
        ))}
        {/* Show +N for users without avatars or beyond first 3 */}
        {joinedCount > shownAvatars.length && (
          <div className="avatar-count">+{joinedCount - shownAvatars.length}</div>
        )}
      </div>
    );
  }

  return (
    <div className="no-users">
      <IoPeopleOutline />
      <span>0</span>
    </div>
  );
}

