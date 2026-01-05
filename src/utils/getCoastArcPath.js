// function to get the path for the coast arc based on the coast direction and size
export function getCoastArcPath(coastDirection, size = 'small') {
    const paths = {
      small: {
        N: "M 15 8 A 20 20 0 0 1 35 8",
        NE: "M 35 8 A 20 20 0 0 1 42 15",
        E: "M 42 15 A 20 20 0 0 1 42 35",
        SE: "M 42 35 A 20 20 0 0 1 35 42",
        S: "M 35 42 A 20 20 0 0 1 15 42",
        SW: "M 15 42 A 20 20 0 0 1 8 35",
        W: "M 8 35 A 20 20 0 0 1 8 15",
        NW: "M 8 15 A 20 20 0 0 1 15 8",
      },
      large: {
        N: "M 21 11 A 28 28 0 0 1 49 11",
        NE: "M 49 11 A 28 28 0 0 1 59 21",
        E: "M 59 21 A 28 28 0 0 1 59 49",
        SE: "M 59 49 A 28 28 0 0 1 49 59",
        S: "M 49 59 A 28 28 0 0 1 21 59",
        SW: "M 21 59 A 28 28 0 0 1 11 49",
        W: "M 11 49 A 28 28 0 0 1 11 21",
        NW: "M 11 21 A 28 28 0 0 1 21 11",
      }
    };
    
    return paths[size]?.[coastDirection] || "";
  }