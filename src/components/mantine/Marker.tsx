import { Avatar, Group, MultiSelect, Text } from "@mantine/core";
import { forwardRef } from "react";
import { useState } from "react";

function Select(props: { value: any; setValue: (value: any) => void }) {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      props.setValue([]);
    }
  });

  return (
    <MultiSelect
      // label="Places"
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
    description:
      "bank, coworking, embassy, library, police, post_box, post_office",
  },

  {
    image: "/assets/food-button.svg",
    label: "Food",
    value: "restaurant",
    description:
      "bar, fast-food, seafood, food, organic, deli, confectionery, bakery",
  },
  {
    image: "/assets/shopping-button.svg",
    label: "Shopping",
    value: "fashion",
    description:
      "beauty, art, bicycle, books, carpet, clothes, computer, cosmetics, department_store, electronics, fashion, florist, furniture, garden_centre, general, gift, hardware, jewelry, kiosk, mall, music, shoes, shopping_centre, sports, stationery, toys",
  },
  {
    image: "/assets/groceries-button.svg",
    label: "Groceries",
    value: "supermarket",
    description: "convenience, deli, organic, markerplace",
  },
  {
    image: "/assets/health-button.svg",
    label: "Health",
    value: "hospital",
    description:
      "pharmacy, massage, optician, salon, hairdresser, clinic, dentist, doctors, gym",
  },
  {
    image: "/assets/hotels-button.svg",
    label: "Hotels",
    value: "hotel",
    description: "chalet, camp_site, caravan_site, guest_house, hostel, motel",
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
