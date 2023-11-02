import { z } from "zod";
import { openai } from "~/lib/open-ai";
import AWS from "aws-sdk";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { icons, users } from "~/server/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { iconStyle } from "~/lib/constant";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: "us-east-1",
  signatureVersion: "v4",
});

const BUCKET_NAME = "icon-generator2130";

async function generateIcon(prompt: string, numberOfIcon: number) {
  try {
    const response = await openai.images.generate({
      prompt,
      n: numberOfIcon,
      size: "512x512",
      response_format: "b64_json",
    });
    return response.data.map((result) => result.b64_json);
  } catch (error) {
    console.log(error);
  }
}

export const openaiRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        n: z.number().positive(),
        prompt: z.string(),
        bgColor: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const getCredit = async () => {
          const remainingCredits = await ctx.db
            .select()
            .from(users)
            .where(eq(users.id, ctx.session.user.id));
          return remainingCredits[0]?.credits;
        };

        const number = await getCredit();

        if (number && number <= input.n) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "you do not have enough credits",
          });
        }

        const creditToDecrease = input.n;
        await ctx.db
          .update(users)
          .set({
            credits: sql`${users.credits} - ${creditToDecrease}`,
          })
          .where(
            and(eq(users.id, ctx.session.user.id), gte(users.credits, input.n)),
          );

        const selectedIconStyle = iconStyle.find(
          (style) => style.id === input.type,
        );
        if (!selectedIconStyle) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid icon style type",
          });
        }

        // const prompt = `Create ICON of ${input.prompt}. Use these style digital art, digital art icon, ${selectedIconStyle.style}. Only USE ICON the style that is given to you. DO NOT use any other ICON style from YOUR SIDE. MOST IMPORTANT thing is to LEAVE some SPACING from all side of the icon from RIGHT, LRFT, TOP, BOTTOM and  also from every CORNER of the icon. `;
        // const prompt = `Create ICON of ${
        //   input.prompt
        // } in ${input.bgColor.toUpperCase()} COLOR. Use STRICTLY the color given to you. DO NOT use any other color combination. Use these style digital art, digital icon art, ${
        //   selectedIconStyle.style
        // }. Only USE ICON the style that is given to you. DO NOT use any other ICON style from YOUR SIDE. Most important thing is to make it in SQUARE shape with rounded corner and border around the icon also keep some SPACING from edge of the icon. In Realistic, Hyper Realistic, resolution.`;
        // console.log(prompt);
        const generatedIcons = await generateIcon(input.prompt, input.n);

        if (!generatedIcons) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Image is not created something went wrong",
          });
        }

        const createdIcons = await Promise.all(
          generatedIcons.map(async (image) => {
            try {
              const insertedIcon = await ctx.db.insert(icons).values({
                userId: ctx.session.user.id,
                prompt: input.prompt,
              });

              if (!image) {
                throw new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "No image to upload on s3s",
                });
              }

              await s3
                .putObject({
                  Bucket: BUCKET_NAME,
                  Body: Buffer.from(image, "base64"),
                  ContentEncoding: "base64",
                  ContentType: "image/png",
                  Key: insertedIcon.insertId,
                })
                .promise();

              return insertedIcon;
            } catch (error) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Eroor on our server while saving in db our s3",
              });
            }
          }),
        );
        return createdIcons.map((icon) => {
          const url = s3.getSignedUrl("getObject", {
            Bucket: BUCKET_NAME,
            Key: icon?.insertId,
          });
          return url;
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});

// const prompt = `Create ICON of ${
//   input.prompt
// } in ${input.bgColor.toUpperCase()} COLOR. Use STRICTLY the color given to you. DO NOT use any other color combination. Use these style digital art, digital icon art, ${
//   selectedIconStyle.style
// }. Only USE ICON the style that is given to you. DO NOT use any other ICON style from YOUR SIDE. MOST IMPORTANT thing is to LEAVE some SPACING from all side of the image from RIGHT, LRFT, TOP, BOTTOM and  also from every CORNER of the image.`;
// console.log(prompt);
