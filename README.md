# Polymarket AI Agent

A Next.js-based AI agent for interacting with Polymarket prediction markets, built using the agent-next-boilerplate framework.

## Project Overview

This AI agent allows users to fetch data about prediction markets, perform market analysis, and execute transactions on Polymarket. It provides a comprehensive set of API endpoints that can be used by AI assistants to interact with Polymarket data and functionality.

## Features

- **Market Data Retrieval**
  - List all markets with filtering options
  - Get detailed information about specific markets
  - Find trending markets
  - Search for markets by keywords

- **Market Analysis**
  - Analyze market performance and trading activity
  - Compare multiple markets to identify correlations
  - Analyze market sentiment based on price movements

- **Transaction Capabilities**
  - Place bets on market outcomes
  - Add and remove liquidity from markets
  - View transaction history

## Tech Stack

- **Framework**: Next.js 15
- **Architecture**: Based on [agent-next-boilerplate](https://github.com/BitteProtocol/agent-next-boilerplate)
- **API Specification**: OpenAPI 3.0.0
- **Language**: TypeScript

## Directory Structure

```
polymarket-agent/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-plugin/
│   │   │   │   └── route.ts           # OpenAPI specification
│   │   │   ├── tools/
│   │   │   │   ├── polymarket/
│   │   │   │   │   ├── config.ts      # Configuration and helpers
│   │   │   │   │   ├── markets/       # Market data endpoints
│   │   │   │   │   ├── analysis/      # Analysis endpoints
│   │   │   │   │   └── transaction/   # Transaction endpoints
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/polymarket-agent.git
cd polymarket-agent
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create a `.env.local` file with the following variables:
```
POLYMARKET_API_URL=https://api.polymarket.com
POLYMARKET_API_KEY=your-api-key
ACCOUNT_ID=your-account-id
```

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

5. The agent will be available at `http://localhost:3000`

## API Documentation

For detailed API documentation, please refer to the [documentation.md](./documentation.md) file.

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add the required environment variables in the Vercel project settings
4. Deploy the application

### Building for Production

```bash
npm run build
# or
pnpm build
```

### Starting the Production Server

```bash
npm start
# or
pnpm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
