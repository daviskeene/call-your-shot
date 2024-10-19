import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";

type Option = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: Option[];
  placeholder?: string; // Placeholder text
  noMatchText?: string; // Text to display when no matches are found
  value?: string; // Controlled value
  onChange?: (value: string) => void; // Callback when value changes
};

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  placeholder = "Select or type...",
  noMatchText = "No match found.",
  value = "",
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [value_, setValue] = React.useState(value);

  // Synchronize inputValue with the value prop
  useEffect(() => {
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) {
      setInputValue(selectedOption.label);
    } else {
      setInputValue(value);
    }
  }, [value, options]);

  const handleSelect = (option: Option) => {
    setInputValue(option.label);
    setValue(option.value);
    onChange?.(option.value); // Update parent with the selected value
    setOpen(false);
  };

  const handleInputChange = (input: string) => {
    setInputValue(input);
    onChange?.(input); // Update parent with the new input
    if (!open) setOpen(true); // Open the Popover when typing
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {inputValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={(currentValue) => handleInputChange(currentValue)} // Use onChange instead of onValueChange
            autoFocus // Auto-focus the input when Popover opens
          />
          <CommandList>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.label}
                  value={option.value}
                  onSelect={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
