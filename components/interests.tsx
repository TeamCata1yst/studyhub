import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface InterestInputProps {
  onChange?: (interests: string[]) => void;
  placeholder?: string;
  label?: string;
}

export default function InterestInput({
  onChange,
  placeholder = "Type an interest and press Enter",
  label = "Interests",
}: InterestInputProps) {
  const [interests, setInterests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();
      const newInterest = inputValue.trim().toLowerCase();
      if (!interests.includes(newInterest)) {
        const updatedInterests = [...interests, newInterest];
        setInterests(updatedInterests);
        onChange?.(updatedInterests);
      }
      setInputValue("");
    }
  };

  const handleDelete = (interestToRemove: string) => {
    const updatedInterests = interests.filter(
      (interest) => interest !== interestToRemove,
    );
    setInterests(updatedInterests);
    onChange?.(updatedInterests);
  };

  return (
    <div className="w-full">
      <Label htmlFor="interest-input">{label}</Label>
      <div className="flex flex-wrap gap-1 pt-1 pb-1">
        {interests.map((interest) => (
          <span
            key={interest}
            className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md"
          >
            {interest}
            <X
              className="h-3 w-3 cursor-pointer hover:text-gray-500"
              onClick={() => handleDelete(interest)}
            />
          </span>
        ))}
        <Input
          id="interest-input"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
