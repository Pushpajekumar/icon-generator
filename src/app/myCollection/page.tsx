import Image from "next/image";
import React from "react";
import { api } from "~/trpc/server";
import DownloadButton from "../_components/downloadButton";

const page = async () => {
  const myCollection = await api.collection.getMyCollection.query();
  return (
    <main className="mt-20 flex min-h-screen items-center justify-center px-5 py-10">
      <section className="flex flex-wrap justify-center gap-5">
        {myCollection.map((collection, i) => {
          return (
            <div key={i} className="relative">
              <Image
                src={collection}
                alt="collection"
                width={300}
                height={300}
              />
              <DownloadButton url={collection} />
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default page;
