import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider>
            <Component {...pageProps} />
        </SessionProvider>
    );
}
