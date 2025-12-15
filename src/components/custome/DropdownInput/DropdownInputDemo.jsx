import React, { useState } from "react";
import { DropdownInput } from "./DropdownInput";

export default function DropdownInputDemo() {
  // Simple array of strings
  const simpleOptions = ["Option 1", "Option 2", "Option 3"];

  // Object array
  const objectOptions = [
    { id: "opt1", label: "Option 1" },
    { id: "opt2", label: "Option 2" },
    { id: "opt3", label: "Option 3" },
  ];

  const [simpleSelected, setSimpleSelected] = useState("Option 3");
  const [objectSelected, setObjectSelected] = useState({
    id: "opt2",
    label: "Option 2",
  });

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Dropdown Input Demo</h2>
      <div>
        <h3>Simple Array Dropdown</h3>
        <DropdownInput
          options={simpleOptions}
          selectedValue={simpleSelected}
          onValueChange={setSimpleSelected}
        />
        <p>Selected: {simpleSelected}</p>
      </div>
      <div>
        <h3>Object Array Dropdown</h3>
        <DropdownInput
          options={objectOptions}
          selectedValue={objectSelected}
          onValueChange={setObjectSelected}
        />
        <p>Selected: {JSON.stringify(objectSelected)}</p>
      </div>
      <div>
        <h3>Object Array with Custom Selected Value (object)</h3>
        <DropdownInput
          options={objectOptions}
          selectedValue={objectSelected} // default to second option
          onValueChange={setObjectSelected}
        />
        <p>Selected: {JSON.stringify(objectSelected)}</p>
      </div>
    </div>
  );
}
