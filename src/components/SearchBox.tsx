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
    }
  }

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
        <Box sx={{ cursor: "pointer" }} bg={"cyan"} w={300} mt={10}>
          <ul aria-label="main mailbox folders">
            {listPlace.map((item) => {
              return (
                <div key={item?.place_id}>
                  <li
                    onClick={() => {
                      setSelectPosition({ lat: item.lat, lng: item.lon });
                      setSearchText("");
                      setVisible(false);
                    }}
                  >
                    <p>{item?.display_name} </p>
                  </li>
                  <br />
                </div>
              );
            })}
          </ul>
        </Box>
      )}
    </Box>
  );
}
