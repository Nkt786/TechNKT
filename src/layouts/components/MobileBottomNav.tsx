import React, { useState, useEffect } from "react";
import {
  LuHouse,
  LuShoppingBag,
  LuCodeXml,
  LuCircleUserRound,
} from "react-icons/lu";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", icon: LuHouse },
  { label: "Store", href: "/shop", icon: LuShoppingBag },
  { label: "Web Dev", href: "/web-development", icon: LuCodeXml },
  { label: "Account", href: "/account", icon: LuCircleUserRound },
];

export default function MobileBottomNav() {
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return currentPath === "/" || currentPath === "";
    }
    return currentPath.startsWith(href);
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-3.5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[390px] pointer-events-auto"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-between rounded-2xl bg-[#151D2B]/95 border border-white/10 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm font-semibold"
                  : "text-[#A6B1C2] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon className="size-[19px] mb-1" />
              <span className="text-[11px] leading-none tracking-tight">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
