import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const Header: React.FC = () => {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Call Your Shot</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/leaderboard" className={navigationMenuTriggerStyle()}>
                  <NavigationMenuLink active={location.pathname === "/leaderboard"}>
                    Leaderboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/profile" className={navigationMenuTriggerStyle()}>
                  <NavigationMenuLink active={location.pathname === "/profile"}>
                    Profile
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <Button
          variant='outline'
          aria-label="Toggle Theme"
          className="mr-4 ml-auto"
          onClick={() => window.location.replace('/create-bet')}
        >
            New Shot Bet
        </Button>
      </div>
    </header>
  )
}

export default Header;
