"use client";
import React from "react";
import MenuSelect from "@/ui/components/MenuSelect";

export default function DemoMenuSelect() {
  const [value, setValue] = React.useState<string>("");
  return (
    <div className="w-full max-w-md">
      <MenuSelect
        label="Choose Location"
        items={[
          { value: "", label: "Unknown Location" },
          { value: "kitchen", label: "Kitchen" },
          { value: "bedroom", label: "Bedroom" },
          { value: "living", label: "Living Room" },
        ]}
        value={value}
        onChange={setValue}
        footerAction={{
          label: "➕ Add new location",
          onClick: () => alert("Navigate to /add_location"),
        }}
      />
      <div className="mt-2 text-sm opacity-75">Selected: {value || "none"}</div>
    </div>
  );
}
