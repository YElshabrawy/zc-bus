import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Container } from 'postcss';
import MaxWidthWrapper from '@/components/custom/MaxWidthWrapper';
import Navbar from '@/components/custom/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
    title: 'ZC Bus',
    description: '',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    inter.variable,
                    'relative h-full font-sans antialiased'
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="relative flex flex-col min-h-screen">
                        <Navbar />
                        <div className="flex-grow flex-1">{children}</div>
                    </main>
                </ThemeProvider>
            </body>
            {/* <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    inter.variable
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <MaxWidthWrapper>{children}</MaxWidthWrapper>
                </ThemeProvider>
            </body> */}
        </html>
    );
}