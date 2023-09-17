import L from "leaflet";
import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";

const Nearby = (props: { places: string[]; id: string }) => {
  const [alreadyS, setAlreadyS] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);

  const featAdd = useMutation(api.map.insertFeat);
  const mapFeatMut = useMutation(api.map.insertFeatToMap);

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

    let url;
    if (alreadyS.length === 0) {
      url = `https://nominatim.openstreetmap.org/search?viewbox=${coordinates}&format=geocodejson&limit=20&bounded=1&amenity=${description}`;
    } else {
      url = `https://nominatim.openstreetmap.org/search?viewbox=${coordinates}&format=geocodejson&limit=20&bounded=1&amenity=${description}&exclude_place_ids=${JSON.stringify(
        alreadyS
      )}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
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
          setAlreadyS(place.properties.geocoding.place_id);
        });

        setFeatures([...p]);
      });
  }, [props.places]);

  const AddMarker = (index: number) => {
    map.eachLayer(async (layer) => {
      if (layer.options && layer.options.pane === "markerPane") {
        if (layer.options.uniceid === index) {
          const featid = await featAdd({
            geometry: {
              type: "Point",
              coordinates: [layer._latlng.lng, layer._latlng.lat],
            },
            type: "Feature",
            style: {
              //   color: "#3388ff",
              weight: 5,
              opacity: 0.65,
            },
            properties: {
              popupContent: layer._popup.options.children[0].props.children,
              icon: layer.options.icon.options.iconUrl,
            },
          });

          await mapFeatMut({ featId: featid, mapId: props.id as string });
        }
      }
    });
    // console.log(a);
  };

  return features.map((item, i) => {
    return (
      // @ts-ignore
      <Marker icon={item.icon} position={item.position} key={i} uniceid={i}>
        <Popup className="">
          <div>{item.popupContent}</div>
          <button onClick={() => AddMarker(i)}>Save marker 💗</button>
        </Popup>
      </Marker>
    );
  });
};

export default Nearby;
