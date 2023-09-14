import React, { useState } from "react";
import ElementMaker from "./elment";

function Foo(props: { emoji: string; label: string; classs: string }) {
  // Set App's state
  const [fullName, setFullName] = useState(props.label);
  const [showInputEle, setShowInputEle] = useState(false);

  return (
    <a className={props.classs}>
      <ElementMaker
        value={fullName}
        handleChange={(e) => setFullName(e.target.value)}
        handleDoubleClick={() => setShowInputEle(true)}
        handleBlur={() => setShowInputEle(false)}
        showInputEle={showInputEle}
      />
    </a>
  );
}

export default Foo;
