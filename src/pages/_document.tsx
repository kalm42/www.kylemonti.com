import { Html, Head, Main, NextScript } from "next/document"
import { THEME_INIT_SCRIPT } from "~/shared/theme"

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
			</Head>
			<body className='antialiased'>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
