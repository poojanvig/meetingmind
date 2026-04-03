"use client"

import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CategoryItem {
  [key: string]: string
}

interface CategoryProps {
  title: string
  items: CategoryItem[]
  gridSpan?: string
}

const CategoryCard: React.FC<CategoryProps> = ({ title, items, gridSpan }) => {
  return (
    <div className="border border-[#e5e5e5] rounded-xl h-full overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5] bg-[#fafafa]">
        <span className="text-[13px] font-semibold text-[#0a0a0a]">{title}</span>
        <span className="text-[11px] font-medium text-[#999] bg-white border border-[#eee] px-1.5 py-0.5 rounded tabular-nums">
          {items.length}
        </span>
      </div>
      {/* Content */}
      <div className="p-3">
        <ScrollArea className="h-[200px]">
          {items.length === 0 ? (
            <p className="text-[13px] text-[#ccc] text-center py-8">No items</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="bg-[#fafafa] border border-[#f0f0f0] rounded-lg px-3.5 py-2.5">
                  {Object.entries(item).map(([key, value]) => {
                    const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    let formattedValue = value;
                    if (key === 'due_date' && value.includes('T')) {
                      formattedValue = value.split('T')[0];
                    }
                    return (
                      <div key={key} className="flex gap-1.5 text-[13px] leading-relaxed">
                        <span className="font-medium text-[#0a0a0a] whitespace-nowrap">{formattedKey}:</span>
                        <span className="text-[#666]">{formattedValue}</span>
                      </div>
                    );
                  })}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

export default CategoryCard
