import { rem } from "@mantine/core";
import React from "react";

// for testing new ui
function ElementMaker(props: {
  showInputEle: boolean;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleDoubleClick: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}) {
  return (
    // Render a <span> element
    <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
      {
        // Use JavaScript's ternary operator to specify <span>'s inner content
        props.showInputEle ? (
          <input
            type="text"
            value={props.value}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            autoFocus
          />
        ) : (
          <span
            style={{ marginRight: rem(9), fontSize: rem(16) }}
            onDoubleClick={props.handleDoubleClick}
            // style={{
            //   display: "inline-block",
            //   height: "25px",
            //   minWidth: "300px",
            // }}
          >
            {props.value}
          </span>
        )
      }
    </span>
  );
}

export default ElementMaker;
