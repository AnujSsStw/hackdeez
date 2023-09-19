import { Avatar, Group, MultiSelect, Text } from "@mantine/core";
import { forwardRef } from "react";

function Select(props: { value: any; setValue: (value: any) => void }) {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      props.setValue([]);
    }
  });

  return (
    <MultiSelect
      placeholder="Places nearby"
      itemComponent={SelectItem}
      data={data}
      onChange={(value) => {
        props.setValue(value);
      }}
      searchable
      nothingFound="..."
      maxDropdownHeight={400}
      filter={(value, selected, item) =>
        !selected &&
        (item.label?.toLowerCase().includes(value.toLowerCase().trim()) ||
          item.description.toLowerCase().includes(value.toLowerCase().trim()))
      }
    />
  );
}
export default Select;

export const data = [
  {
    image: "/assets/services-button.svg",
    label: "Services",
    value: "atm",
    description: "bank, police, post_box, post_office",
  },

  {
    image: "/assets/food-button.svg",
    label: "Food",
    value: "restaurant",
    description: "bar, fast-food, seafood, food, bakery",
  },
  {
    image: "/assets/shopping-button.svg",
    label: "Shopping",
    value: "fashion",
    description: "beauty, art, books, carpet, clothes",
  },
  {
    image: "/assets/groceries-button.svg",
    label: "Groceries",
    value: "supermarket",
    description: "convenience, organic, markerplace",
  },
  {
    image: "/assets/health-button.svg",
    label: "Health",
    value: "hospital",
    description: "pharmacy, dentist, doctors",
  },
  {
    image: "/assets/hotels-button.svg",
    label: "Hotels",
    value: "hotel",
    description: "guest_house, hostel, motel",
  },
  {
    image: "/assets/transport-button.svg",
    label: "Transport",
    value: "station",
    description: "station",
  },
];

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar src={image} />

        <div>
          <Text>{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);
