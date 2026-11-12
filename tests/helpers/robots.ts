/** Parse the comma-separated directives in a robots meta content attribute. */
export function normalizeRobotsDirectives(content: string | undefined): string[] {
  return content === undefined
    ? []
    : content.split(',').map((directive) => directive.trim().toLowerCase()).sort()
}
