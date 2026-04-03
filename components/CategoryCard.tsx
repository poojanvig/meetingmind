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
  colorScheme?: { bg: string; border: string; header: string; badge: string; badgeText: string; itemBg: string; itemBorder: string; accent: string }
}

const defaultColors = {
  bg: "bg-white",
  border: "border-indigo-100/80",
  header: "from-indigo-50/80 to-violet-50/80",
  badge: "bg-indigo-50 border-indigo-100",
  badgeText: "text-indigo-600",
  itemBg: "bg-indigo-50/30",
  itemBorder: "border-indigo-100/50",
  accent: "text-indigo-700",
}

const CategoryCard: React.FC<CategoryProps> = ({ title, items, gridSpan, colorScheme }) => {
  const colors = colorScheme || defaultColors

  return (
    <div className={`border ${colors.border} rounded-2xl h-full overflow-hidden ${colors.bg} shadow-sm`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${colors.border} bg-gradient-to-r ${colors.header}`}>
        <span className={`text-[13px] font-semibold ${colors.accent}`}>{title}</span>
        <span className={`text-[11px] font-semibold ${colors.badgeText} ${colors.badge} border px-2 py-0.5 rounded-full tabular-nums`}>
          {items.length}
        </span>
      </div>
      {/* Content */}
      <div className="p-3">
        <ScrollArea className="h-[200px]">
          {items.length === 0 ? (
            <p className="text-[13px] text-[#b0b0c8] text-center py-8">No items</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className={`${colors.itemBg} border ${colors.itemBorder} rounded-xl px-3.5 py-2.5`}>
                  {Object.entries(item).map(([key, value]) => {
                    const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    let formattedValue = value;
                    if (key === 'due_date' && value.includes('T')) {
                      formattedValue = value.split('T')[0];
                    }
                    return (
                      <div key={key} className="flex gap-1.5 text-[13px] leading-relaxed">
                        <span className={`font-medium ${colors.accent} whitespace-nowrap`}>{formattedKey}:</span>
                        <span className="text-[#5a5a7a]">{formattedValue}</span>
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
