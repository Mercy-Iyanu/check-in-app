import { Providers } from './providers'

export const metadata = {
    title: 'DC Check In App',
    description: 'The Dream Centre children church check-in-check-out web application',
    icons: [
        {
            rel: 'icon',
            url: '/favicon/favicon.ico'
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            url: '/favicon/favicon-32x32.png'
        },
        {
            rel: 'icon',
            type: 'image/png',
            sizes: '16x16',
            url: '/favicon/favicon-16x16.png'
        },
        {
            rel: 'apple-touch-icon',
            sizes: '180x180',
            url: '/favicon/apple-touch-icon.png'
        }
    ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            {/*  prevent extensions from causing a mismatch 
      https://stackoverflow.com/a/75339011/5197022 */}
            <body suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
