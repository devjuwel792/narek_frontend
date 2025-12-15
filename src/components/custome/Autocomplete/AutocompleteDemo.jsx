import * as React from "react";
import { Autocomplete } from "./";

const sampleOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Date", value: "date" },
  { label: "Elderberry", value: "elderberry" },
  { label: "Fig", value: "fig" },
  { label: "Grape", value: "grape" },
  { label: "Honeydew", value: "honeydew" },
];

export default function AutocompleteDemo() {
  const [selected, setSelected] = React.useState(null);

  const handleSelect = (value) => {
    setSelected(value);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Autocomplete Demo</h2>
      <Autocomplete
        options={sampleOptions}
        onSelect={handleSelect}
        placeholder="Search fruits..."
      />
      {selected && (
        <p className="mt-4 text-sm text-muted-foreground">
          Selected: <strong>{selected.label}</strong> ({selected.value})
        </p>
      )}
    </div>
  );
}
