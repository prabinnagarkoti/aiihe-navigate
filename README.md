# AIIHE Navigate 🎓

An inclusive, smart campus navigation Progressive Web App (PWA) built for the Australian Institute of Innovative Higher Education (AIIHE) Brisbane campus.

This project was built to solve real-world campus navigation issues, heavily focusing on wheelchair accessibility, WCAG standards, and usability across desktop, mobile, kiosks, and smartwatches.

## 🌟 Key Features

1. **Accessible Route Planner**: Dijkstra-based routing algorithm that prioritizes ramps and elevators when "Wheelchair Mode" is enabled, avoiding all stairs.
2. **Live GPS Navigation**: Real-time blue-dot tracking using HTML5 Geolocation.
3. **Voice Guidance**: Turn-by-turn text-to-speech navigation using the browser's Web Speech API.
4. **High-Contrast Mode**: Instantly toggle to WCAG AAA compliant black/yellow/white scheme.
5. **Interactive Campus Map**: Leaflet.js with free OpenStreetMap tiles.
6. **Smartwatch Companion View**: Responsive UI mimicking a paired smartwatch for quick turn glances.
7. **Kiosk Mode**: Automatically detects large screens (>=1920px) to switch to a full-screen, sidebar layout.
8. **Fully Installable PWA**: Service workers, offline caching, and "Add to Home Screen" support.

## 🛠 Tech Stack

- **Next.js 15 (App Router)** - React framework
- **TypeScript** - Strongly typed code
- **Tailwind CSS** - Utility-first styling
- **Leaflet & React-Leaflet** - Open-source mapping
- **Lucide React** - Minimalist icons
- **Vercel** - Zero-config deployment

## 🚀 Getting Started

### Local Development

1. Clone or download the repository.
2. Ensure you have Node.js 18+ installed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Map Setup / Custom Coordinates

All map data is stored in simple JSON files. *No backend or API keys are required.*
To update the campus layout, edit the files in `src/data/`:

- **`campus-locations.json`**: Add/edit buildings, rooms, elevators, and entrances. Include exact `lat`/`lng` coordinates.
- **`campus-paths.json`**: Define the walking graph. Each edge has a `from`, `to`, `type` (e.g., stairs, ramp), and an `accessible` boolean.
- **`campus-events.json`**: Update today's schedule for the event feed.

*Note: For the best results when capturing lat/lng, use Google Maps on desktop, right-click exactly on a doorway or ramp, and copy the coordinates.*

## 🌍 Instant Vercel Deployment

This app is ready to deploy directly to Vercel without any special configuration.

1. Push this folder to a GitHub repository.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Keep all default settings (Framework Preset: Next.js).
5. Click **Deploy**.
6. Done! Your PWA is live and installable on any iOS or Android device.

## ♿ Accessibility Notes

This project was built following universal design principles:
- Minimum `48x48px` touch targets for interactive elements.
- ARIA roles (`role="combobox"`, `role="switch"`, `aria-live`, etc.) manually implemented across custom UI components.
- Color palettes tested for major types of color-blindness.
- Purely browser-native APIs (Geolocation, Speech) to ensure maximum device compatibility without 3rd party bloat.
