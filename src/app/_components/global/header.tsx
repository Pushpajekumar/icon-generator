import React from "react";
import { Button } from "~/components/ui/button";
import { ToggleTheme } from "./toogle-theme";
import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import MobileNav from "./mobile-nav";

const Header = async () => {
  const session = await getServerAuthSession();
  const getCredit = async () => {
    if (session) {
      const remainingCredits = await db
        .select()
        .from(users)
        .where(eq(users.id, session?.user.id));
      return remainingCredits[0]?.credits;
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-20 items-center justify-between border-b bg-white/20 px-5 backdrop-blur-2xl">
      <Link href={"/"}>
        <h1 className="text-3xl font-semibold">Generator</h1>
      </Link>
      <div className="hidden items-center gap-5 md:flex">
        <ul className="flex gap-5">
          <li>
            <Link href={"/generate"}>Generate</Link>
          </li>
          <li>
            <Link href={"/myCollection"}>My Collection</Link>
          </li>
        </ul>
        <p>{getCredit()} credit</p>
        <p className="text-base font-semibold">
          {session && <span> {session.user?.name}</span>}
        </p>
        <Link href={"/sign-in"}>
          <Button variant={"ghost"}>{session ? "Sign out" : "Sign in"}</Button>
        </Link>
        <ToggleTheme />
      </div>
      <div className="flex items-center gap-5 md:hidden">
        <div>
          {session ? (
            <p>{getCredit()} credit </p>
          ) : (
            <Link href={"/sign-in"}>
              <Button variant={"ghost"}>Sign in</Button>
            </Link>
          )}
        </div>
        <ToggleTheme />
        <MobileNav />
      </div>
    </header>
  );
};

export default Header;
