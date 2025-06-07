# cyber-project

A modern SvelteKit web application for flight logging and planning, featuring user authentication, aircraft and logbook management, and a responsive UI powered by TailwindCSS and DaisyUI.

[![Build Status](https://github.com/Oded2/cyber-project/actions/workflows/ci.yml/badge.svg)](https://github.com/Oded2/cyber-project/actions)

## Features

- ✈️ Flight logbook and planning tools
- 🛩️ Aircraft registration and management
- 📅 Calendar and logbook views for flights
- 🔒 User authentication (Supabase)
- 🌍 Country and geo data integration (GeoJSON)
- 🎨 Modern UI with TailwindCSS and DaisyUI
- 🧪 Prettier and linting for code quality

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) or [yarn](https://yarnpkg.com/)

### Installation

```sh
git clone https://github.com/Oded2/cyber-project.git
cd cyber-project
npm install
```

### Development

Start the development server:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Project Structure

```
cyber-project/
├── src/
│   ├── app.css                # TailwindCSS & DaisyUI config
│   ├── app.html               # Main HTML template
│   ├── hooks.server.ts        # SvelteKit hooks (Supabase integration)
│   ├── lib/                   # Shared libraries, assets, and data
│   │   ├── components/        # Svelte components (UI, forms, logbook, etc.)
│   │   ├── hrefs.json         # Navigation links
│   │   ├── countries.json     # Country code-name mapping
│   │   ├── banned.json        # List of banned countries
│   │   └── index.ts           # Library entry point
│   └── routes/                # SvelteKit routes (pages & endpoints)
├── static/                    # Static assets (images, geojson, etc.)
│   ├── background.jpg
│   ├── countries.geojson
│   └── favicon.png
├── .env.local                 # Local environment variables
├── package.json               # Project metadata and scripts
├── postcss.config.js          # PostCSS config for TailwindCSS
├── svelte.config.js           # SvelteKit config
├── tsconfig.json              # TypeScript config
└── README.md                  # Project documentation
```

## Environment Variables

Create a `.env.local` file for local development. See `.env.example` for required variables.

## Scripts

- `npm run dev` – Start the dev server
- `npm run build` – Build for production
- `npm run preview` – Preview the production build
- `npm run format` – Format code with Prettier
- `npm run lint` – Check code formatting

## Technologies Used

- [SvelteKit](https://kit.svelte.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Supabase](https://supabase.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/)

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

Made by [Oded2](https://github.com/Oded2)
