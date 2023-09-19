import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/router";

import { NotFoundTitle } from "@/components/mantine/Error";
import { NavbarSearch } from "@/components/mantine/SideNavbar";
import { Flex, Skeleton } from "@mantine/core";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";

const Room = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/Map"), {
        loading: () => (
          <p>
            <Skeleton height={8} mt={6} width="100%" />
          </p>
        ),
        ssr: false,
      }),
    []
  );
  const router = useRouter();
  const [places, setPlaces] = useState<any>([]);
  const [toolControl, setToolControl] = useState(false);

  const { user } = useUser();
  const { slug } = router.query;

  const geo = useQuery(
    api.map.mapfeat,
    slug !== undefined && user !== undefined
      ? { mapId: slug[0], userId: user!.id }
      : "skip"
  );
  const mapDetails = useQuery(
    api.map.getMap,
    slug !== undefined ? { mapId: slug[0] } : "skip"
  );

  useEffect(() => {
    if (!mapDetails) return;

    if (!mapDetails.isPublic) {
      for (let i = 0; i < mapDetails.sendInvite.canEdit.length; i++) {
        if (
          mapDetails.sendInvite.canEdit[i] ===
          user?.emailAddresses[0].emailAddress
        ) {
          setToolControl(true);
          break;
        }
      }

      if (mapDetails.anyOneWithLink) {
        setToolControl(true);
      }
    } else if (mapDetails.isPublic) {
      setToolControl(false);
    }

    if (mapDetails.creator === user?.id) {
      console.log("creator");
      setToolControl(true);
    }
  }, [mapDetails?.anyOneWithLink]);

  if (!user || !slug || !mapDetails) {
    return <NotFoundTitle />;
  } else if (
    user.id !== mapDetails.creator &&
    slug &&
    mapDetails &&
    mapDetails.anyOneWithLink === false &&
    mapDetails.isPublic === false
  ) {
    return <div>Not for you bro</div>;
  }

  return (
    <Flex>
      <NavbarSearch
        onChange={setPlaces}
        value={places}
        d={mapDetails}
        col={geo}
        link={router.asPath}
        isCreator={mapDetails.creator === user.id}
      />
      <Map
        roomId={slug![0]}
        userId={user!.id}
        geojson={geo}
        profilePic={user.imageUrl}
        userName={user.firstName as string}
        places={places}
        mapDetails={mapDetails}
        toolControl={toolControl}
      />
    </Flex>
  );
};

export default Room;
