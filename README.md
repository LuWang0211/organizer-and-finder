This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

This project will be automatically deployed to Vercel upon PR merge to masterover

## Biome Tooling

Biome handles linting and formatting in this repo. Follow the steps below to make sure your editor uses it consistently.

### 1. Install dependencies

- Run `npm install` once after cloning so the local `node_modules/.bin/biome` binary is available.
- Verify the CLI is wired up by running `npx biome --version` (optional but handy for debugging PATH issues).

### 2. Add the editor plugin

- **VS Code / Cursor**: Open the Extensions view, search for “Biome”, and install the official extension published by **biomejs**. Cursor shares the VS Code marketplace, so the same extension applies there.
- Reload the editor after installation so it can detect the workspace Biome binary.

### 3. Point formatting to Biome

- Open the Command Palette (`Ctrl/Cmd + P`) → type ">"→ Search **Open VS Code Settings**.
- Search for “Biome” and enable **Biome › Enable** so the extension activates.
- Still in Settings, search for “Default Formatter” and choose **Biome (biomejs.biome)** from the dropdown.


### 4. Enable auto save + format-on-save

- In the Settings UI, Search for “Format On Save” and toggle it on so Biome runs whenever a file is saved.
- Optionally search for “Code Actions On Save” edit the setting with this config:
```
    "editor.codeActionsOnSave": {
        "source.biome": "always",
        "source.fixAll.biome": "always"
    }
```

With these toggles enabled, every manual save (and auto save, if configured) runs Biome once.

### 5. Temporarily skip formatting

- Use the **File: Save Without Formatting** command (`Ctrl/Cmd` + `K`, `S`) when you need to bypass Biome for a single save.
- Alternatively toggle `editor.formatOnSave` off from the command palette, then back on once you are done with the temporary change.

### 6. Configuration basics

- The root-level `biome.json` file controls lint rules and formatter behavior.
- Common tweaks include updating the `formatter.indentWidth`, `formatter.lineWidth`, or enabling/disabling rules under `linter.rules`.
- Reload the editor after editing `biome.json` so the plugin picks up changes.
- This is the configuration guide for Biome: https://biomejs.dev/guides/configure-biome/

### 7. During daily development cylces
- Use `npm run lint` to lint and fix automatically-fixable issues.
- Use `npm run lint-check-only` to only check issues but no fixing them. This is the same command run by CI.
