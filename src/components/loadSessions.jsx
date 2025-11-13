// src/components/FetchSessions.jsx
import { useState, useEffect } from "react";
import Parse from "../parse-init";

export default function loadSessions() {
  const [sessions, setSessions] = useState([]);
  const [joinedSessions, setJoinedSessions] = useState([]);

  useEffect(() => {
    async function useSessions() {
      try {
        const SessionClass = Parse.Object.extend("Session_");
        const query = new Parse.Query(SessionClass);
        query.include("spotId");
        const results = await query.find();

        const mapped = results.map((obj) => {
          const spotObj = obj.get("spotId");
          const date = obj.get("sessionDateTime");

          let dateLabel = "-";
          let timeLabel = "-";
          if (date) {
            dateLabel = date.toLocaleDateString();
            timeLabel = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          }
          console.log("Session raw:", obj.toJSON());
          console.log("Spot pointer:", obj.get("spotId"));

          return {
            id: obj.id,
            spot: spotObj,
            dateLabel,
            timeLabel,
            windKts: obj.get("windPower"),
            tempC: obj.get("temperature"),
            weather: obj.get("weatherType"),
            windDir: obj.get("windDirection"),
            avatars: [],
          };
        });

        setSessions(mapped);
      } catch (err) {
        console.error("Failed to load sessions", err);
      }
    }

    useSessions();
  }, []);

  const handleJoinSession = (sessionId) => {
    setJoinedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const joinedSessionsList = sessions.filter((s) =>
    joinedSessions.includes(s.id)
  );

  return { sessions, joinedSessions, joinedSessionsList, handleJoinSession };
}
