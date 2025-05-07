"use client";
import { type ComponentProps, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Pencil, PencilOff } from "lucide-react";

type Props = ComponentProps<typeof Input> & {
  onEditCancel?: () => void;
};

export default function EditInput({ onEditCancel, ...props }: Props) {
  const [editable, setEditable] = useState(false);
  const toggleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (editable && onEditCancel) {
      onEditCancel();
    }
    setEditable(!editable);
  };
  return (
    <div className="flex items-center gap-4">
      <Input {...props} disabled={!editable} />
      <Button variant="outline" size="icon" onClick={toggleEdit}>
        {editable ? <PencilOff /> : <Pencil />}
      </Button>
    </div>
  );
}
