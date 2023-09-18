import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { isOnline, PresenceData } from "../hooks/usePresence";
import Control from "react-leaflet-custom-control";
import { Avatar } from "@mantine/core";
import { useMap } from "react-leaflet";
import { Id } from "../../convex/_generated/dataModel";

const UPDATE_MS = 1000;

type FacePileProps = {
  othersPresence?: PresenceData<{
    emoji: string;
    name: string;
    lat: number;
    lng: number;
    color: string;
    img: string;
  }>[];
};

export default ({ othersPresence }: FacePileProps) => {
  const [, setNow] = useState(Date.now());
  const [observe, setObserve] = useState<string>("");
  const map = useMap();

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), UPDATE_MS);
    return () => clearInterval(intervalId);
  }, [setNow]);

  useEffect(() => {
    if (observe) {
      const presence = othersPresence?.find((p) => p.user === observe);
      if (presence) {
        map.flyTo([presence.data.lat, presence.data.lng], 16);
      }
    } else {
      // observation is off
    }
  }, [othersPresence, observe, map]);

  function panTouser(user: string) {
    if (observe === user) {
      console.log("observe off");
      setObserve("");
    } else {
      const presence = othersPresence?.find((p) => p.user === user);
      if (presence) {
        console.log("observe on");
        setObserve(presence.user);
      }
    }
  }

  return (
    <div className="relative z-[99999] p-2 flex gap-2">
      {othersPresence
        ?.slice(0, 5)
        .map((presence) => ({
          ...presence,
          online: !isOnline(presence),
        }))
        .sort((presence1, presence2) =>
          presence1.online === presence2.online
            ? presence1.created - presence2.created
            : Number(presence1.online) - Number(presence2.online)
        )
        .filter((presence) => !presence.online)
        .map((presence) => (
          <span
            className={"text-xl " + (presence.online ? "animate-pulse" : "")}
            key={presence.created}
            title={
              !presence.online
                ? "Online"
                : "Last seen " + new Date(presence.updated).toDateString()
            }
          >
            <Avatar
              src={presence.data.img}
              alt="it's me"
              onClick={() => panTouser(presence.user)}
              className={
                observe === presence.user ? `ring-2 ring-blue-600` : ""
              }
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            />
          </span>
        ))}
    </div>
  );
};
