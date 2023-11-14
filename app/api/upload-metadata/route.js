import { NextResponse, NextRequest } from "next/server";
import { getTokenMetadata } from "@/app/_utils/contract";
const { Storage } = require("@google-cloud/storage");
require("dotenv").config();

// Read from .env google key for bucket
const credential = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString()
);

// Create Storage variable with credentials
const storage = new Storage({
  projectId: "windfall-staking",
  credentials: {
    client_email: credential.client_email,
    private_key: credential.private_key,
  },
});

const bucket = storage.bucket("windfall-wintoken");

// Upload metadata to cloud
async function uploadMetadata(tokenId, network) {
  console.log("Uploading Metadata");
  try {
    const metadata = await getTokenMetadata(tokenId, network);
    const fileName = `metadata_${tokenId}.json`;
    const file = bucket.file(`windfall-metadata/${fileName}`);
    file
      .save(JSON.stringify(metadata), {
        contentType: "application/json",
      })
      .then(() => {});
    console.log(
      `JSON data has been uploaded to gs://windfall-wintoken/windfall-metadata/${fileName}`
    );
  } catch (error) {
    console.log("Error uploading metadata");
    console.log("Error: ", error.message);
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await uploadMetadata(data.tokenId, data.network);
    return NextResponse.json(
      {
        message: `JSON data has been uploaded to gs://windfall-wintoken/windfall-metadata/`,
      },
      { status: 201 }
    );
    // The response from the API if an error occurs
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
