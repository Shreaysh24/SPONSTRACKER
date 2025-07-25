"use client"
import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";


const URL_EndPoint = process.env.NEXT_PUBLIC_URI_ENDPOINT
export default function Providers({ children }) {
    return (
        <SessionProvider refetchInterval={5 * 60} >

            <ImageKitProvider urlEndpoint={URL_EndPoint} >
                {children}
            </ImageKitProvider>
        </SessionProvider>

    );
}