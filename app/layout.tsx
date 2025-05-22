import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";

const heebo = Heebo({
    variable: "--font-heebo",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Brasfi",
    description: "Plataforma Brasfi",
};

interface IProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: IProps) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body
                className={`${heebo.variable} antialiased font-heebo`}
                suppressHydrationWarning
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
