# RWA Airdrop User Frontend

A Next.js-based frontend application for managing real-world asset airdrops with Web3Auth integration and Robinhood account connectivity.

## Features

- Web3Auth Integration for wallet authentication
- Robinhood account connection (mocked for now)
- Holdings management and display
- ZK Proof generation for airdrop claims
- Responsive UI with Tailwind CSS

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Web3Auth
- Ethers.js
- Prisma (SQLite)
- shadcn/ui components

## Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- SQLite

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID='YOUR_CLIENT_ID'
DATABASE_URL='YOUR_DATABASE_URL'
```

4. Initialize the database:

```bash
bunx prisma generate
bunx prisma migrate dev
```

## Development

Run the development server:

```bash
bun dev
```

## API Endpoints

- `/api/rh/auth` - Robinhood authentication
- `/api/rh/signup` - User registration
- `/api/get-holdings` - Fetch user holdings
- `/api/check-robinhood-connection` - Verify Robinhood connection
- `/api/create-robinhood-connection` - Create new Robinhood connection

## Database Schema

The application uses three main models:

1. User - Stores user authentication details
2. UserHolding - Manages user's stock holdings
3. UserRegistry - Tracks wallet addresses and Robinhood connections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
