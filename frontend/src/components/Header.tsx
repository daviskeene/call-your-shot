import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center">
        <Link to="/" className="mr-4 flex items-center">
          <span className="font-bold">Call Your Shot</span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/leaderboard" className={navigationMenuTriggerStyle()}>
                <NavigationMenuLink
                  active={location.pathname === "/leaderboard"}
                >
                  Leaderboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/search" className={navigationMenuTriggerStyle()}>
                <NavigationMenuLink active={location.pathname === "/search"}>
                  Search
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Button
        variant="outline"
        aria-label="New Shot Bet"
        onClick={() => navigate("/create-bet")}
      >
        New Shot Bet
      </Button>
    </>
  );
};

export default Header;
