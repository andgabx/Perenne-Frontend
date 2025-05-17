"use client";

import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
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
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <SessionProvider session={session}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
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
