"use client";
import { type ComponentProps, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Pencil, PencilOff } from "lucide-react";
type Props = ComponentProps<typeof Input> & {};
export default function EditInput({ ...props }: Props) {
  const [editable, setEditable] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Input {...props} disabled={!editable} />
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          setEditable(!editable);
        }}
      >
        {editable ? <PencilOff /> : <Pencil />}
      </Button>
    </div>
  );
}
