import AWS from "aws-sdk";

export const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: `${your_bucket_region}`,
  signatureVersion: "v4",
});

export const BUCKET_NAME = `${your_bucket_name}`;
