import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <div className="flex items-center">
        <Link to="/" className="mr-4 flex items-center">
          <span className="font-bold text-indigo-500">Call Your Shot</span>
        </Link>
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/leaderboard" className={navigationMenuTriggerStyle()}>
              <NavigationMenuLink
                active={location.pathname === "/leaderboard"}
                className="text-indigo-500"
              >
                Leaderboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/log" className={navigationMenuTriggerStyle()}>
              <NavigationMenuLink
                active={location.pathname === "/log"}
                className="text-indigo-500"
              >
                Log
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/search" className={navigationMenuTriggerStyle()}>
              <NavigationMenuLink
                active={location.pathname === "/search"}
                className="text-indigo-500"
              >
                Search
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};

export default Header;
