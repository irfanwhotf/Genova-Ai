# GenovaAI - AI Image Generation

A modern web application for generating images using AI, built with Next.js and React.

## Features

- Modern, responsive UI with Tailwind CSS
- AI-powered image generation
- Image download functionality
- Mobile-friendly design

## Tech Stack

- Next.js 14 (App Router)
- React.js
- Tailwind CSS
- Flux-Dev AI API

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_KEY="Free-For-YT-Subscribers-@DevsDoCode-WatchFullVideo"
NEXT_PUBLIC_API_BASE_URL="https://api.ddc.xiolabs.xyz/v1"
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Cloudflare Pages

### Build Settings

Configure the following in Cloudflare Pages:

1. Framework preset: Next.js
2. Build command: `npm run build`
3. Build output directory: `.next`
4. Node.js version: 18.x or higher

### Environment Variables

Add these environment variables in Cloudflare Pages settings:
- `NEXT_PUBLIC_API_KEY`
- `NEXT_PUBLIC_API_BASE_URL`

### Additional Settings

1. In your `package.json`, ensure you have:
```json
{
  "scripts": {
    "build": "next build"
  }
}
```

2. Make sure `next.config.js` is properly configured for image domains.

3. Enable these Cloudflare Pages settings:
   - Disable "Automatically expose Next.js configuration"
   - Enable "Next.js compatibility mode"

## License

MIT

## Credits

Created by [Your Name]
