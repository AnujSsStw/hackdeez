import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  Group,
  Input,
  Flex,
  Select,
  Header,
} from "@mantine/core";
import { IconAt } from "@tabler/icons-react";

function Share(props: { mapName: string }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={"Share " + props.mapName}
        centered
        sx={{
          zIndex: 999,
        }}
      >
        {/* Modal content */}
        <Flex>
          <Input icon={<IconAt />} placeholder="Email" />
          <Select
            label="Your favorite framework/library"
            placeholder="Pick one"
            data={[
              { value: "react", label: "React" },
              { value: "ng", label: "Angular" },
              { value: "svelte", label: "Svelte" },
              { value: "vue", label: "Vue" },
            ]}
          />
          <Button onClick={close}>Send invite</Button>
        </Flex>
      </Modal>

      <Group
        sx={{
          zIndex: 999,
          position: "absolute",
        }}
      >
        <Button onClick={open}>Share</Button>
      </Group>
    </>
  );
}

export default Share;
