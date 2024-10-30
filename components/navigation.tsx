// Navigation Bar Component of Header

import { createSupabaseServerComponentClient } from "@/lib/supabase/server";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import LoginButton from "@/components/login-button";
import LogoutButton from "@/components/logout-button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function NavigationBar() {
  const supabase = await createSupabaseServerComponentClient();

  // authenticate the user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // these navigation buttons are shown to both logged in and logged out users

  // array of common buttons
  const commonButtonsArray = [
    { href: "/plants", label: "Plants" },
    { href: "/nature-walk", label: "Nature Walk" },
  ];

  // generate common buttons for desktop
  const commonButtonsDesktop = commonButtonsArray.map((button, index) => (
    <Link key={index} href={button.href}>
      <Button>{button.label}</Button>
    </Link>
  ));

  // generate common buttons for mobile
  const commonButtonsMobile = commonButtonsArray.map((button, index) => (
    <Link key={index} href={button.href}>
      <DropdownMenuItem>
        <Button className="w-full">{button.label}</Button>
      </DropdownMenuItem>
    </Link>
  ));

  // conditionally show the login or logout button
  return (
    <>
      {/* Desktop */}
      <nav className="navigation hidden md:flex">
        {commonButtonsDesktop}
        {user ? (
          <>
            <Link href="/admin/add">
              <Button variant={"outline"}>Add Plant</Button>
            </Link>
            <Link href="/reports">
              <Button variant={"outline"}>Reports</Button>
            </Link>
            <LogoutButton name={user?.user_metadata?.full_name || "User"} />
          </>
        ) : (
          <LoginButton />
        )}
      </nav>

      {/* Mobile */}
      <nav className="navigation-mobile md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-64">Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            {commonButtonsMobile}
            {user ? (
              <>
                <Link href="/admin/add">
                  <DropdownMenuItem>
                    <Button variant={"outline"} className="w-full">
                      Add Plant
                    </Button>
                  </DropdownMenuItem>
                </Link>
                <Link href="/reports">
                  <DropdownMenuItem>
                    <Button variant={"outline"} className="w-full">
                      Reports
                    </Button>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <LogoutButton
                    name={user?.user_metadata?.full_name || "User"}
                  />
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem>
                <LoginButton />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
}
