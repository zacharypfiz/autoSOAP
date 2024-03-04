import { SidebarLink } from "@/components/SidebarItems";
import { Cog, Globe, HomeIcon, ScrollText } from "lucide-react";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/notes", title: "Notes", icon: ScrollText },
  { href: "/account", title: "Account", icon: Globe },
  { href: "/settings", title: "Settings", icon: Cog },
];

export const additionalLinks: AdditionalLinks[] = [];
