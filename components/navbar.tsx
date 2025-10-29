"use client";
import { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Image,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { Search } from "lucide-react";

import { FlowWalletConnect } from "@/components/flow-wallet-connect";
import { SearchPopover } from "@/components/search/search-popover";
import { SearchDrawer } from "@/components/search/search-drawer";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function App() {
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();

        const isMobile = window.innerWidth < 1024;

        if (isMobile) {
          setIsSearchDrawerOpen(true);
        } else {
          setIsSearchPopoverOpen(true);

          setTimeout(() => {
            const searchInput = document.querySelector(
              'input[type="search"]',
            ) as HTMLInputElement;

            if (searchInput) {
              searchInput.focus();
            }
          }, 100);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Navbar isBordered classNames={{ wrapper: "max-w-7xl" }}>
      <NavbarContent justify="start">
        <Link href="/">
          <NavbarBrand className="mr-4 gap-2">
            <Image
              alt="Trixy Logo"
              className="rounded-none"
              height={32}
              src={"/logo-white.png"}
              width={32}
            />
            <h1 className="hidden sm:block font-black text-2xl">Trixy</h1>
          </NavbarBrand>
        </Link>
      </NavbarContent>

      <NavbarContent as="div" className="items-center gap-3" justify="end">
        <div className="hidden lg:block">
          <SearchPopover
            isOpen={isSearchPopoverOpen}
            onOpenChange={setIsSearchPopoverOpen}
          />
        </div>

        <Button
          isIconOnly
          className="lg:hidden h-10 w-10 bg-default-100 rounded-xl"
          size="sm"
          variant="flat"
          onPress={() => setIsSearchDrawerOpen(true)}
        >
          <Search size={20} />
        </Button>

        <FlowWalletConnect />
      </NavbarContent>

      <SearchDrawer
        isOpen={isSearchDrawerOpen}
        onOpenChange={setIsSearchDrawerOpen}
      />
    </Navbar>
  );
}
