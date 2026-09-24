import { Html, Head, Main, NextScript } from "next/document"
import { THEME_INIT_SCRIPT } from "~/shared/theme"

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<link rel='icon' href='/favicon.svg' type='image/svg+xml' />
				<link rel='icon' href='/icon-32.png' type='image/png' sizes='32x32' />
				<link rel='icon' href='/favicon.ico' sizes='any' />
				<link rel='apple-touch-icon' href='/apple-touch-icon.png' />
				<link rel='manifest' href='/manifest.json' />
				<meta name='theme-color' content='#f6f1e7' media='(prefers-color-scheme: light)' />
				<meta name='theme-color' content='#0f1813' media='(prefers-color-scheme: dark)' />
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
			</Head>
			<body className='antialiased'>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
