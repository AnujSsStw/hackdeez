import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import "https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css";

const createRoutineMachineLayer = () => {
  L.Marker.prototype.options.icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  });

  // @ts-ignore
  const instance = L.Routing.control({
    waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
    routeWhileDragging: true,
    position: "topleft",
    lineOptions: {
      styles: [{ color: "#000", opacity: 0.8, weight: 4 }],
      extendToWaypoints: true,
      missingRouteTolerance: 200,
    },
    collapseBtnClass: "leaflet-routing-collapse-btn",
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
