import usePresence, { isOnline } from "@/hooks/usePresence";
import { randomColor } from "@/util/helper";
import { useUser } from "@clerk/clerk-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Id } from "../../convex/_generated/dataModel";
import Geoman from "./GeomanControl";
import Facepile from "./Profiles";
import SearchBox from "./SearchBox";
import LiveLocationButton from "./mantine/Location";
import Nearby from "./nearby";

function LocationMarker(props: Data) {
  const [position, setPosition] = useState<any>([51.52, -0.09]);
  const [searchLocation, setSearchLocation] = useState<any>(null);
  const [data, others, updatePresence] = usePresence(
    props.roomId as string,
    props.userId,
    {
      emoji: "👋",
      name: props.userName,
      lat: 0,
      lng: 0,
      color: randomColor(),
      img: props.profilePic,
    }
  );
  const map = useMap();

  const a = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);

      const icon = L.icon({
        iconUrl: "/assets/liveLocation.svg",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
      });
      L.marker(e.latlng, { icon: icon, draggable: false }).addTo(a);

      a.flyTo(e.latlng, a.getZoom());
    },
  });
  useEffect(() => {
    a.locate();
  }, [a]);

  useEffect(() => {
    if (searchLocation) {
      a.flyTo(searchLocation, a.getZoom());
    }
  }, [searchLocation]);

  map.on("mousemove", function (e) {
    // console.log("working");
    void updatePresence({ lat: e.latlng.lat, lng: e.latlng.lng });
  });

  const icon = L.icon({
    iconUrl: "/assets/marker.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  });

  return position === null ? null : (
    //   @ts-ignore
    <>
      {searchLocation && <Marker position={searchLocation} icon={icon} />}

      {/* pretty much ok */}
      <LiveLocationButton />
      <ZoomControl position="bottomright" />
      <SearchBox
        selectPosition={searchLocation}
        setSelectPosition={setSearchLocation}
      />
      <Nearby places={props.places} id={props.roomId as string} />

      <Facepile othersPresence={others} />

      {others
        ?.filter(isOnline)
        .filter((presence) => presence.data.lat && presence.data.lng)
        .map((presence) => {
          return (
            <Marker
              key={presence.updated}
              position={[presence.data.lat, presence.data.lng]}
              icon={L.divIcon({
                html:
                  '<svg width="18" height="18" style="z-index:9999!important; cursor:none;" viewBox="0 0 18 18" fill="none" style="background:none;" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.51169 15.8783L1.08855 3.64956C0.511984 2.05552 2.05554 0.511969 3.64957 1.08853L15.8783 5.51168C17.5843 6.12877 17.6534 8.51606 15.9858 9.23072L11.2573 11.2573L9.23074 15.9858C8.51607 17.6534 6.12878 17.5843 5.51169 15.8783Z" fill="' +
                  presence.data.color +
                  '"/></svg>',
                iconSize: [22, 22], // size of the icon
                iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62], // the same for the shadow
                className: "cursoricon",
              })}
            >
              <Tooltip
                direction="right"
                offset={[20, 20]}
                opacity={1}
                permanent
              >
                {presence.data.name}
              </Tooltip>
            </Marker>
          );
        })}
    </>
  );
}

export type Data = {
  userId: string;
  roomId: string | string[] | undefined;
  geojson?:
    | ({
        _id: Id<"feat">;
        _creationTime: number;
        style?: any;
        type: string;
        geometry: any;
        properties: {};
      } | null)[]
    | undefined;
  places: string[];
  mapDetails:
    | {
        _id: Id<"map">;
        _creationTime: number;
        name?: string | undefined;
        des?: string | undefined;
        featIds: Id<"feat">[];
        mapId: string;
        isPublic: boolean;
        sendInvite: {
          restricted: boolean;
          canEdit: string[];
        };
        creator: string;
        anyOneWithLink: boolean;
      }
    | null
    | undefined;

  profilePic: string;
  userName: string;
};

const Map = (props: Data) => {
  const { user } = useUser();
  const [toolControl, setToolControl] = useState(false);

  useEffect(() => {
    if (!props.mapDetails) return;

    for (let i = 0; i < props.mapDetails.sendInvite.canEdit.length; i++) {
      if (
        props.mapDetails.sendInvite.canEdit[i] ===
        user?.emailAddresses[0].emailAddress
      ) {
        setToolControl(true);
        break;
      }
    }

    if (props.mapDetails.creator === user?.id) {
      console.log("creator");
      setToolControl(true);
    }
  }, [props.mapDetails?.anyOneWithLink]);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // className="map-tile"
      />
      {props.geojson?.map((feat) => {
        return (
          <GeoJSON
            key={feat?._id}
            data={feat}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(feature.properties.popupContent);

              if (feature.geometry.type === "LineString") {
                if (!feature.style) return;
                layer.setStyle({
                  color: feature.style.color,
                  weight: 3,
                  smoothFactor: 1,
                });
              }

              if (feature.properties.icon) {
                layer.setIcon(
                  L.icon({
                    iconUrl: feature.properties.icon,
                    iconSize: [30, 30],
                    iconAnchor: [15, 30],
                    shadowAnchor: [4, 62],
                    popupAnchor: [1, -34],
                    // tooltipAnchor: [16, -28],
                  })
                );
              } else if (feature.geometry.type === "Point") {
                layer.setIcon(
                  L.icon({
                    iconUrl: "/assets/marker.svg",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    // tooltipAnchor: [16, -28],
                  })
                );
              }
            }}
          />
        );
      })}
      <LocationMarker {...props} />
      {toolControl && <Geoman mapId={props.roomId} />}
    </MapContainer>
  );
};

export default Map;
