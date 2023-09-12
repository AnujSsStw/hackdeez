import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
  GeoJSON,
} from "react-leaflet";
import Geoman from "./GeomanControl";
import SearchBox from "./SearchBox";
import LiveLocationButton from "./mantine/Location";
import usePresence, { isOnline } from "@/hooks/usePresence";

function LocationMarker(props: Data) {
  const [position, setPosition] = useState<any>([51.52, -0.09]);
  const [searchLocation, setSearchLocation] = useState<any>(null);
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

  // const [data, others, updatePresence] = usePresence(
  //   props.roomId as string,
  //   props.userId,
  //   {
  //     emoji: "👋",
  //     lat: 0,
  //     lng: 0,
  //   }
  // );

  // useEffect(() => {
  //   map.on("mousemove", function (e) {
  //     console.log(e.latlng);
  //     void updatePresence({ lat: e.latlng.lat, lng: e.latlng.lng });
  //   });
  //   // when click on drawed polygon
  // }, [map]);

  const icon = L.icon({
    iconUrl: "/assets/marker.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  });

  var cursor_icon = L.divIcon({
    html:
      '<svg width="18" height="18" style="z-index:9999!important; cursor:none;" viewBox="0 0 18 18" fill="none" style="background:none;" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.51169 15.8783L1.08855 3.64956C0.511984 2.05552 2.05554 0.511969 3.64957 1.08853L15.8783 5.51168C17.5843 6.12877 17.6534 8.51606 15.9858 9.23072L11.2573 11.2573L9.23074 15.9858C8.51607 17.6534 6.12878 17.5843 5.51169 15.8783Z" fill="' +
      "black" +
      '"/></svg>',
    iconSize: [22, 22], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    className: "cursoricon",
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

      {/* {others
        ?.filter(isOnline)
        .filter((presence) => presence.data.lat && presence.data.lng)
        .map((presence) => {
          return (
            <Marker
              key={presence.created}
              position={[presence.data.lat, presence.data.lng]}
              icon={cursor_icon}
            >
              <Tooltip>{presence.user}</Tooltip>
            </Marker>
          );
        })} */}
      {/* <Share mapName="map" /> */}
    </>
  );
}

type Data = {
  userId: string;
  roomId: string | string[] | undefined;
};

const Map = (props: Data) => {
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
      <LocationMarker {...props} />
      <Geoman />
    </MapContainer>
  );
};

export default Map;
