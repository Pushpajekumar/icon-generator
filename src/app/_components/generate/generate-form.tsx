"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Download, Loader, MoveRight } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be 2 letter or bigger than 2",
  }),
  numberOfImage: z.number().positive(),
  bgColor: z.string(),
});

const GenerateForm = () => {
  const [image, setImage] = React.useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const response = api.openai.create.useMutation({
    onSuccess: (res) => {
      console.log(res);
      setImage(res);
      setLoading(false);
    },
    onError: (err) => {
      console.log(err);
      setLoading(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      numberOfImage: 1,
      bgColor: "#22C55E",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    response.mutate({
      n: values.numberOfImage,
      prompt: values.prompt,
      bgColor: values.bgColor,
      type: "3d render, 3d, 3d art, minimlist",
    });
    form.reset();
  }

  const tailwindColors = [
    { name: "Gray", hex: "#718096" },
    { name: "Red", hex: "#DC2626" },
    { name: "Yellow", hex: "#F59E0B" },
    { name: "Green", hex: "#22C55E" },
    { name: "Blue", hex: "#2563EB" },
    { name: "Indigo", hex: "#4F46E5" },
    { name: "Purple", hex: "#9333EA" },
    { name: "Pink", hex: "#D946EF" },
  ];

  return (
    <section className="mx-auto max-w-6xl justify-center px-3 py-14 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Describe your image</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="cat on the rat..."
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numberOfImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of image you want to generate</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1"
                    type="number"
                    className="w-full"
                    required
                    {...field}
                    onChange={(e) => {
                      form.setValue("numberOfImage", parseInt(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bgColor"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Notify me about...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-wrap items-center justify-center gap-5 md:justify-start"
                  >
                    {tailwindColors.map((item, i) => (
                      <FormItem
                        key={i}
                        className="flex  items-center space-x-3 space-y-0"
                      >
                        <FormControl style={{ backgroundColor: item?.hex }}>
                          <RadioGroupItem value={item?.hex} />
                        </FormControl>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size={"lg"} disabled={loading} type="submit">
            {loading ? (
              <p className="flex gap-3">
                {" "}
                Generating your image please wait...{" "}
                <Loader className="animate-spin" />
              </p>
            ) : (
              <p className="flex gap-3">
                Generate <MoveRight />
              </p>
            )}
          </Button>
        </form>
      </Form>

      <div className="flex flex-wrap items-center justify-center ">
        {image ? (
          <div className="my-10 flex items-center gap-5 ">
            {image.map((item, i) => (
              <div
                key={i}
                className="relative flex h-96 items-center justify-center"
              >
                <Image
                  src={item}
                  className="z-50"
                  alt="next-image"
                  width={300}
                  height={400}
                  placeholder="blur"
                  blurDataURL={item}
                />
                {/* <Link href={`${item}`} download="Example-PDF-document"> */}
                <Button
                  className="absolute right-0 top-0"
                  variant={"destructive"}
                  size={"icon"}
                >
                  <Download />
                </Button>
                {/* </Link> */}
              </div>
            ))}
          </div>
        ) : (
          <p className="z-50 text-5xl text-white">no image found....</p>
        )}
      </div>
    </section>
  );
};

export default GenerateForm;
