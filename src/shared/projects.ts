import type { ProjectCardProps } from "~/components/ProjectCard"

type Project = Omit<ProjectCardProps, "index">

const PROJECTS: Project[] = [
	{
		name: "Color Names",
		host: "color-names.com",
		description:
			"Deterministic, human-readable names for every visibly distinguishable color, in any format you give it.",
		status: "Live",
		href: "https://color-names.com",
	},
	{
		name: "Monti Realty",
		host: "montirealty.com",
		description:
			"A real estate investment analysis tool for sizing up a rental property's numbers before you buy. Not investment advice.",
		status: "Live",
		href: "https://www.montirealty.com/",
	},
]

export { PROJECTS }
export type { Project }
