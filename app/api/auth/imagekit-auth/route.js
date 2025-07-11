import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const authParameter = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    });

    // ✅ Fix: Return the actual keys directly
    return Response.json(authParameter);
  } catch (error) {
    console.error("Error generating upload auth params:", error);
    return Response.json(
      { error: "Failed to generate upload auth parameters" },
      { status: 500 }
    );
  }
}
