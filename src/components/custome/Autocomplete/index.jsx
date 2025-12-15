import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Autocomplete = React.forwardRef(
  (
    {
      options = [],
      onSelect,
      placeholder = "Type to search...",
      className,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const [filteredOptions, setFilteredOptions] = React.useState(options);
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const [selectedOption, setSelectedOption] = React.useState(null);
    const inputRef = React.useRef(null);
    const listRef = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));

    React.useEffect(() => {
      const filtered = options.filter((option) =>
        inputValue.length > 0
          ? option.label.toLowerCase().includes(inputValue.toLowerCase())
          : true
      );
      setFilteredOptions(filtered);
      setSelectedIndex(-1);
    }, [inputValue, options]);

    const handleInputChange = (e) => {
      const value = e.target.value;
      setInputValue(value);
      setIsOpen(true);
    };

    const handleInputFocus = () => {
      setIsOpen(true);
    };

    const handleInputBlur = () => {
      // Delay closing to allow for item selection
      setTimeout(() => setIsOpen(false), 150);
    };

    const handleItemClick = (option) => {
      setSelectedOption(option);
      setInputValue(option.label);
      setIsOpen(false);
      onSelect?.(option);
    };

    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (
            selectedIndex >= 0 &&
            selectedIndex < filteredOptions.length
          ) {
            handleItemClick(filteredOptions[selectedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    React.useEffect(() => {
      if (selectedIndex >= 0 && listRef.current) {
        const selectedItem = listRef.current.children[selectedIndex];
        if (selectedItem) {
          selectedItem.scrollIntoView({
            block: "nearest",
            inline: "nearest",
          });
        }
      }
    }, [selectedIndex]);

    return (
      <div className={cn("relative", className)}>
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          {...props}
        />
        {isOpen && filteredOptions.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-60 overflow-auto"
          >
            {filteredOptions.map((option, index) => (
              <li
                key={option.value || option.label}
                className={cn(
                  "px-3 py-2 cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground",
                  index === selectedIndex && "bg-accent text-accent-foreground"
                )}
                onMouseDown={() => handleItemClick(option)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

Autocomplete.displayName = "Autocomplete";

export { Autocomplete };
