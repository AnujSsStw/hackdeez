import {
  Box,
  Footer,
  Group,
  Input,
  Modal,
  Navbar,
  RemoveScroll,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconMessage, IconSend, IconSendOff } from "@tabler/icons-react";
import { useStyple2 } from "./random";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useUser } from "@clerk/clerk-react";
import { use, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useIsInViewport } from "@/hooks/useView";
import { Id } from "../../../convex/_generated/dataModel";

const Messages = () => {
  const router = useRouter();
  const { slug } = router.query;
  const user = useUser();
  const { classes } = useStyple2();
  const [openedM, { open: OM, close: CM }] = useDisclosure(false);
  const [message, setMessage] = useState<string>("");

  console.log("openedM", openedM);

  const getMsg = useQuery(
    api.message.getMessages,
    slug !== undefined && openedM ? { room: slug[0] as string } : "skip"
  );

  const sendMsg = useMutation(api.message.sendMessage);
  const likeMsg = useMutation(api.message.likeMessage);

  async function handleMessSend() {
    if (message === "") return;
    await sendMsg({
      message: message,
      room: slug![0] as string,
      userId: user.user?.id as string,
    });

    setMessage("");
  }

  async function handleLike(id: Id<"messages">) {
    await likeMsg({
      messageId: id,
      userId: user.user?.id as string,
    });
  }

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end",
      });
    }
  }, [getMsg?.length]);

  return (
    <>
      <Modal
        opened={openedM}
        onClose={CM}
        withCloseButton={false}
        zIndex={9999999}
        size={"lg"}
        title="Chat's"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Box mb={100} ref={ref}>
          {getMsg?.map((msg) => (
            <>
              <Text size="sm">{msg.user}</Text>
              <Box
                key={msg._id}
                mb={10}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Text size="md">{msg.message}</Text>
                <div
                  onClick={() => {
                    handleLike(msg._id);
                  }}
                >
                  {msg.likes ? <span>{msg.likes}</span> : null} 🤍
                </div>
              </Box>
            </>
          ))}
        </Box>
        <Input
          placeholder="Type here"
          style={{
            position: "fixed",
            bottom: 10,
            width: "calc(100% - 20px)",
            left: 9,
            right: 15,
          }}
          rightSection={<IconSend onClick={handleMessSend} />}
          rightSectionProps={{
            style: {
              cursor: "pointer",
            },
          }}
          onChange={(e) => {
            setMessage(e.currentTarget.value);
          }}
          value={message}
        />
      </Modal>

      <Navbar.Section className={classes.footer}>
        <Group
          className={classes.collectionsHeader}
          onClick={OM}
          sx={{
            cursor: "pointer",
          }}
        >
          <IconMessage size="1rem" />
          <Text>Messages</Text>
        </Group>
      </Navbar.Section>
    </>
  );
};

export default Messages;
