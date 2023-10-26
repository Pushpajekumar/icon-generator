import AWS from "aws-sdk";

export const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: "us-east-1",
  signatureVersion: "v4",
});

export const BUCKET_NAME = "icon-generator2130";
