"use client";

import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const heebo = Heebo({
    variable: "--font-heebo",
    subsets: ["latin"],
});

const metadata: Metadata = {
    title: "Brasfi",
    description: "Plataforma Brasfi",
};

interface IProps {
    children: React.ReactNode;
    session: any;
}

export default function RootLayout({ children, session }: IProps) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body
                className={`${heebo.variable} antialiased font-heebo`}
                suppressHydrationWarning
            >
                <SessionProvider session={session}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
