import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { getServerAuthSession } from "~/server/auth";

const MobileNav = async () => {
  const session = await getServerAuthSession();
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Generator</SheetTitle>
          <SheetDescription>generate what ever you want</SheetDescription>
        </SheetHeader>
        <ul className="flex flex-col gap-3 ">
          <li>
            <Link href={"/"}>Home</Link>
          </li>
          <li>
            <Link href={"/generate"}>Generate</Link>
          </li>
          <li>
            <Link href={"/myCollection"}>My Collection</Link>
          </li>
        </ul>
        <SheetFooter className="my-20">
          <p className="text-base font-semibold">
            {session && <span> {session.user?.name}</span>}
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
