interface MainProps {
	children: React.ReactNode
}

const Main = (props: MainProps) => {
	const { children } = props
	return <main className='max-w-page mx-auto my-0 py-0 print:px-0'>{children}</main>
}

export default Main
