import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

type IProps = {
  tabs: {
    label: string;
    value: string;
  }[];
};

export default function TabSelector({ tabs }: IProps) {
  return (
    <div>
      <TabsList className="overflow-x-auto  bg-[#FBFCFD] flex gap-4 overflow-visible rounded-md">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="px-6 text-base font-medium data-[state=active]:bg-[#F3F4F7]  data-[state=active]:text-tertiary"
          >
            <span className="relative inline-flex items-center">
              {tab.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
