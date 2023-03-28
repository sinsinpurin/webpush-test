// pages/_app.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker.register("/sw.js").then(
                    (registration) => {
                        console.log(
                            "Service Worker registered with scope:",
                            registration.scope,
                        );
                    },
                    (err) => {
                        console.error(
                            "Service Worker registration failed:",
                            err,
                        );
                    },
                );
            });
        }
    }, [router.events]);

    return <Component {...pageProps} />;
}

export default MyApp;
