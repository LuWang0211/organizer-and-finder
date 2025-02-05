export function extractPathFromDirectory(directory: string) {
    return (directory.match("app([/\\\\].*)") ?? [""])[1].replace(/\\/g, "/");
}