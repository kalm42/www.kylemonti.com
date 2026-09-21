import { clsx, type ClassValue } from "clsx"

/**
 * Combines conditional class names into one string. Used wherever a
 * component merges its own variant classes with a caller-supplied
 * `className`.
 *
 * @example cn("text-ink", isActive && "text-brand", className)
 */
function cn(...inputs: ClassValue[]) {
	return clsx(inputs)
}

export { cn }
