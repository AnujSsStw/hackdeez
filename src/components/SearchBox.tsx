import React, { Dispatch, useRef, useState } from "react";
import { Box, Input } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
export default function SearchBox(props: {
  selectPosition: any;
  setSelectPosition: Dispatch<any>;
}) {
  const { selectPosition, setSelectPosition } = props;
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState([]);
  const [visible, setVisible] = useState(false);

  function handleKeyDown(event: any) {
    if (event.key === "Enter") {
      // Search
      setVisible(true);
      const params = {
        q: searchText,
        format: "json",
        addressdetails: 1,
        polygon_geojson: 0,
      };
      //   @ts-ignore
      const queryString = new URLSearchParams(params).toString();

      fetch(`${NOMINATIM_BASE_URL}${queryString}`, {
        method: "GET",
        redirect: "follow",
      })
        .then((response) => response.text())
        .then((result) => {
          setListPlace(JSON.parse(result));
        })
        .catch((err) => console.log("err: ", err));
    }
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setVisible(false);
    }
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        zIndex: 999,
        padding: "10px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
      maw={300}
    >
      <Input
        icon={<IconAt />}
        variant="filled"
        placeholder="Search for a Place"
        radius="sm"
        onChange={(event) => {
          setSearchText(event.target.value);
        }}
        value={searchText}
        w={300}
        onKeyDown={handleKeyDown}
      />
      {visible && (
        <Box sx={{ cursor: "pointer" }} w={300} mt={10}>
          <ul className="bg-white border border-gray-100 w-full mt-2 ">
            {listPlace.map((item) => {
              return (
                <div key={item?.place_id}>
                  <li
                    className="pl-8 pr-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-50 hover:text-gray-900"
                    onClick={() => {
                      setSelectPosition({ lat: item.lat, lng: item.lon });
                      setSearchText("");
                      setVisible(false);
                    }}
                  >
                    <p>{item?.display_name} </p>
                  </li>
                </div>
              );
            })}
          </ul>
        </Box>
      )}
    </Box>
  );
}
