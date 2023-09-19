import { useMutation } from "convex/react";
import L from "leaflet";
import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { api } from "../../convex/_generated/api";

const Nearby = (props: { places: string[]; id: string }) => {
  const [alreadyS, setAlreadyS] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);

  const featAdd = useMutation(api.map.insertFeat);
  // const mapFeatMut = useMutation(api.map.insertFeatToMap);

  const map = useMap();
  useEffect(() => {
    if (props.places.length === 0) {
      map.eachLayer(function (layer) {
        if (layer.hasOwnProperty("feature")) {
          return;
        }
        if (layer instanceof L.Marker) {
          setFeatures([]);
          map.removeLayer(layer);
        }
      });
      return;
    }
    const coordinates =
      map.getBounds().getNorthWest().lng +
      "," +
      map.getBounds().getNorthWest().lat +
      "," +
      map.getBounds().getSouthEast().lng +
      "," +
      map.getBounds().getSouthEast().lat;

    let description: string = "";
    props.places.forEach((item) => {
      description = item;
    });

    if (description.length === 0) return;

    const url = `https://nominatim.openstreetmap.org/search?viewbox=${coordinates}&format=geocodejson&limit=20&bounded=1&amenity=${description}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("hi");

        if (data.error) return;
        var marker_icon = L.icon({
          iconUrl: `/assets/${description}-marker.svg`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          shadowAnchor: [4, 62],
        });
        const p: {
          icon: L.Icon<L.IconOptions>;
          position: any[];
          popupContent: any;
          properties: any;
        }[] = [];

        data.features.forEach((place: any) => {
          p.push({
            icon: marker_icon,
            position: [
              place.geometry.coordinates[1],
              place.geometry.coordinates[0],
            ],
            popupContent: place.properties.geocoding.label,
            properties: place.properties,
          });
        });

        setFeatures([...p]);
      });
  }, [props.places]);

  const AddMarker = async (layer: {
    icon: L.Icon<L.IconOptions>;
    position: any[];
    popupContent: any;
    properties: any;
  }) => {
    await featAdd({
      geometry: {
        type: "Point",
        coordinates: [layer.position[1], layer.position[0]],
      },
      type: "Feature",
      style: {
        weight: 5,
        opacity: 0.65,
      },
      properties: {
        popupContent: layer.popupContent,
        icon: layer.icon.options.iconUrl,
      },
      mapId: props.id as string,
    });

    // await mapFeatMut({ featId: featid, mapId: props.id as string });
  };

  return features.map((item, i) => {
    return (
      // @ts-ignore
      <Marker icon={item.icon} position={item.position} key={i} uniceid={i}>
        <Popup className="bg-white border-2 border-gray-200 rounded-lg shadow-lg max-w-xs">
          <div className="pb-2">{item.popupContent}</div>
          <button
            className="bg-sky-500 hover:bg-sky-700  text-black font-bold py-2 px-4 rounded"
            onClick={() => AddMarker(item)}
          >
            Save marker 💗
          </button>
        </Popup>
      </Marker>
    );
  });
};

export default Nearby;
