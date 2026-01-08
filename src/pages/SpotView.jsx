import "../styles/SpotView.css";
import Sessionblock from "../components/Sessionblock/Sessionblock";
import Parse from "../parse-init";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Chat from "../components/Chat";
import { fetchSpotByName } from "../services/spotService";
import { setupCommentsPolling } from "../utils/setupCommentsPolling";
import { toggleJoinInSessionList } from "../utils/toggleJoinInList";
import Page from "../components/Page";
import TabNavigation from "../components/TabNavigation";
import SpotDetails from "../components/SpotComponents/SpotDetails";
import SpotMap from "../components/SpotComponents/SpotMap";

export default function SpotViewPage() {
  const { spotName } = useParams();
  const name = decodeURIComponent(spotName || "");
  const [spot, setSpot] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [surfSessions, setSurfSessions] = useState([]);
  const user = Parse.User.current();
  const [viewState, setViewState] = useState({
    longitude: spot?.longitude || 12.568,
    latitude: spot?.latitude || 55.65,
    zoom: 13,
  });
  const [activeTab, setActiveTab] = useState("sessions");

  //load spot information and session information via cloud function
  useEffect(() => {
    const loadSpot = async () => {
      setLoading(true); // start loading
      try {
        const spot = await fetchSpotByName(spotName);
  
        const futureSessions = await Parse.Cloud.run("loadSessions", {
          filters: { spotIds: [spot.id], futureOnly: true },
        });
        console.log("Loaded sessions in Spotfeed:", futureSessions);
        setSurfSessions(futureSessions);
  
        setSpot(spot);
      } catch (error) {
        console.error("Error fetching spot by name:", error);
        setSpot(null);
        setSurfSessions([]);
      } finally {
        setLoading(false); // stop loading notification
      }
    };
  
    loadSpot();
  }, [spotName]);

  // updates the map center once the spot data loads
  useEffect(() => {
    if (spot?.latitude && spot?.longitude) {
      setViewState({
        longitude: spot.longitude,
        latitude: spot.latitude,
        zoom: 13,
      });
    }
  }, [spot]);

  // Load comments with polling using utility function
  useEffect(() => {
    return setupCommentsPolling(null, spot?.id, setComments);
  }, [spot?.id]);

  //handle join/unjoin session in spotview
  const onJoin = (id) => async (e) => {
    await toggleJoinInSessionList(id, surfSessions, setSurfSessions);
  };


  if (loading) {
    return <div className="page">Loading spot...</div>;
  }

  // render spot view
  return (
    <Page title={spot?.name || name}>
      <SpotDetails spot={spot} name={name} />

      <SpotMap spot={spot} viewState={viewState} setViewState={setViewState} />

      {/* Windfinder Link */}
      {spot?.windfinderLink && (
        <a
          href={spot.windfinderLink}
          target="_blank"
          rel="noopener noreferrer"
          className="windfinder-link"
        >
          Get more information about the weather →
        </a>
      )}

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: "sessions", label: "Top Sessions" },
          { id: "comments", label: "Comments" },
        ]}
      />

      {activeTab === "sessions" ? (
        <div className="stack">
          {surfSessions.map((s) => (
            <Link key={s.id} to={`/session/${s.id}`} className="session-link">
              <Sessionblock
                key={s.id}
                spot={s.spotName}
                dateLabel={s.dateLabel}
                timeLabel={s.timeLabel}
                windKts={s.windPower}
                tempC={s.temperature}
                weather={s.weatherType}
                windDir={s.windDirection}
                coastDirection={s.coastDirection}
                joinedUsers={s.joinedUsers || []}
                joinedCount={s.joinedCount || 0}
                onJoin={onJoin(s.id)}
                isJoined={s.isJoined}
              />
            </Link>
          ))}
        </div>
      ) : (
        <Chat
          comments={comments}
          currentUser={user}
          setComments={setComments}
          session={null}
          spot={spot}
          showProposedComments={false}
        />
      )}
    </Page>
  );
}
