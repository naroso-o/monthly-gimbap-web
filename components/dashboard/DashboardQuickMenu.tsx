"use client";

import { ExternalLink, MessageSquare, Users, FileText } from "lucide-react";
import { Button } from "../ui/button";

const quickMenuItems = [
  {
    name: "GitHub PR",
    icon: <FileText className="w-5 h-5" />,
    url: "https://github.com/code-gimbap/weekly-post/pulls",
    color: "#8B7355",
  },
  {
    name: "Zep",
    icon: <Users className="w-5 h-5" />,
    url: "https://zep.us",
    color: "#A67C52",
  },
  {
    name: "Discord",
    icon: <MessageSquare className="w-5 h-5" />,
    url: "https://discord.com/channels/1381837514473476196/1381981277195993218r",
    color: "#D4A574",
  },
  {
    name: "Notion",
    icon: <ExternalLink className="w-5 h-5" />,
    url: "https://www.notion.so/zenna9/234195618e9d803a8f82e6722c586ee4",
    color: "#E6B887",
  },
];

export const DashboardQuickMenu = () => {
  const handleMenuClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
        <div className="flex gap-2 w-full justify-center mb-4">
          {quickMenuItems.map((item, index) => (
            <Button
              key={index}
              variant="link"
              onClick={() => handleMenuClick(item.url)}
              className="flex-col items-center justify-center w-24 h-24 p-3 rounded-lg border border-diary-border hover:bg-diary-border/30 transition-colors group"
            >
              <div
                className="p-2 rounded-full mb-2 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <div style={{ color: item.color }}>{item.icon}</div>
              </div>
              <span className="text-xs text-diary-text font-medium text-center leading-tight">
                {item.name}
              </span>
            </Button>
          ))}
        </div>
  );
};
