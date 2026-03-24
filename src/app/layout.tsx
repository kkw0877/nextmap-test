import "@/styles/globals.css"
import { NextLayout, NextProvider } from "./provider";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Fastcampus NextMap',
    description: "Next.js 13을 이용한 맛집 App"
}

export default function RootLayout({ children } : {children: React.ReactNode}) {
    return (
        <html lang="en">
            <body>
                <NextProvider>
                    <NextLayout>
                        { children }
                    </NextLayout>
                </NextProvider>
            </body>
        </html>
    )
}