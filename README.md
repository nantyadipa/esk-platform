# English Sepulang Kerja

Platform web les bahasa Inggris dengan pendaftaran instan via WhatsApp.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma
- **Styling:** Tailwind CSS + Design Tokens
- **UI Components:** shadcn/ui + Radix UI
- **Calendar:** FullCalendar React
- **Testing:** Playwright + pytest (POM)
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run Prisma migrations
npx prisma migrate dev

# Seed database (admin user + WhatsApp config)
npx prisma db seed

# Run development server
npm run dev
```

## Project Structure

See `docs/architecture.md` for detailed project structure and architecture decisions.

## Design Tokens

All design tokens are in `src/styles/design-tokens.css` — source of truth for colors, spacing, fonts, shadows, and more.

## Testing

```bash
# Install Playwright
npx playwright install

# Run E2E tests
npx playwright test
```

## License

Private