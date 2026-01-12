# 51Talk Academy Poster Generator

An AI-powered poster generator for 51Talk Academy that creates personalized learning journey posters for students. Built with React, Vite, and Google Gemini AI.

## Features

- 🎨 **AI-Generated Background Images**: Uses Google Gemini 2.5 Flash to create personalized cinematic backgrounds
- 👫 **Gender-Specific Themes**: Custom prompts for boys (thobe/shemagh) and girls (abaya)
- 📅 **Flexible Scheduling**: Support for multiple class days and times
- 📱 **QR Code Integration**: Automatically generates QR codes for class links
- 📥 **High-Quality Download**: Export posters as PNG images with optimized clarity
- 🌐 **Bilingual Interface**: Arabic and English support

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.5 Flash Image Generation
- **QR Code**: qrcode library
- **Image Export**: html2canvas

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Google Gemini API key ([Get one here](https://ai.google.dev/))

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yarayan327-hash/PosterGenerater.git
   cd PosterGenerater
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   For local development, create a `.env.local` file:

   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

   For Vercel deployment, add `VITE_GEMINI_API_KEY` in project settings.

## Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is configured for deployment on Vercel:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "your commit message"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository to Vercel
   - Add `VITE_GEMINI_API_KEY` as an environment variable in Vercel settings
   - Deploy!

Or use the Vercel CLI:

```bash
vercel login
vercel --prod
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Project Structure

```
.
├── App.tsx              # Main application component
├── types.ts             # TypeScript type definitions
├── index.tsx            # Application entry point
├── index.css            # Tailwind CSS imports
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── .env.example         # Environment variable template
```

## Usage

1. Enter the student's name
2. Select gender (Boy/Girl)
3. Choose class days from the Arabic day buttons
4. Set times for each selected day
5. Paste the class link URL
6. Click "Generate Poster" to create the AI image
7. Click "Download Full Poster" to save the poster

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  lpBlue: '#26B7FF',
  lpDark: '#1E293B',
  lpSoftGray: '#F1F5F9',
  lpYellow: '#FCD34D',
}
```

### AI Prompts

Modify the `constructPrompt()` function in `App.tsx` to change the image generation prompt.

## License

Internal tool for 51Talk Academy.

## Support

For issues or questions, please contact the development team.
