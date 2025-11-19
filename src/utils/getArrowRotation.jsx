export default function getArrowRotation(direction) {
  switch (direction) {
    case "N":
      return 90;
    case "NE":
      return 135;
    case "E":
      return 180;
    case "SE":
      return 225;
    case "S":
      return 270;
    case "SW":
      return 315;
    case "W":
      return 0;
    case "NW":
      return 45;
    default:
      return 0;
  }
}
