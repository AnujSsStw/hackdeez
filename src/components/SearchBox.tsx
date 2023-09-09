import React, { Dispatch, useState } from "react";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
export default function SearchBox(props: {
  selectPosition: any;
  setSelectPosition: Dispatch<any>;
}) {
  const { selectPosition, setSelectPosition } = props;
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState([]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        zIndex: 999,
        backgroundColor: "green",
        padding: "10px",
        width: "300px",
        right: "10px",
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <input
            style={{ width: "100%" }}
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0px 20px",
            cursor: "pointer",
            color: "#0070f3",
          }}
        >
          <button
            onClick={() => {
              // Search
              const params = {
                q: searchText,
                format: "json",
                addressdetails: 1,
                polygon_geojson: 0,
              };
              //   @ts-ignore
              const queryString = new URLSearchParams(params).toString();
              console.log(queryString);

              fetch(`${NOMINATIM_BASE_URL}${queryString}`, {
                method: "GET",
                redirect: "follow",
              })
                .then((response) => response.text())
                .then((result) => {
                  console.log(JSON.parse(result));
                  setListPlace(JSON.parse(result));
                })
                .catch((err) => console.log("err: ", err));
            }}
          >
            Search
          </button>
        </div>
      </div>
      <div style={{ cursor: "pointer" }}>
        <ul aria-label="main mailbox folders">
          {listPlace.map((item) => {
            return (
              <div key={item?.place_id}>
                <li
                  onClick={() => {
                    setSelectPosition({ lat: item.lat, lng: item.lon });
                  }}
                >
                  <p>{item?.display_name} </p>
                </li>
                <br />
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
