import { MoveRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";

const HeroSection = () => {
  return (
    <section className="  relative flex h-screen  items-center justify-center  bg-green-400 ">
      <div className="z-20 flex flex-col items-center justify-center text-slate-100">
        <h1 className="max-w-5xl text-center  leading-normal">
          Crafting Picture-Perfect Images, Tailored to Your Brand, Your Style
        </h1>
        <p className="max-w-4xl text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea inventore,
          illum officia voluptas facilis quis doloremque eveniet unde, illo
          nobis neque, tenetur quibusdam a mollitia eos impedit deserunt rerum
          recusandae fuga quo! Nihil consequatur veniam minima, amet harum
          laudantium in!
        </p>
        <Link href="/generate">
          <Button className="mt-10 flex items-center gap-3" size={"lg"}>
            Get Started <MoveRight />
          </Button>
        </Link>
      </div>
      <video
        muted
        autoPlay
        loop
        className="absolute top-0 h-screen w-screen object-cover brightness-50"
      >
        <source
          src="/assets/video/production_id_4232958 (1080p).mp4"
          type="video/mp4"
        />
      </video>
    </section>
  );
};

export default HeroSection;
