# Trixy Protocol - Frontend

A decentralized prediction market platform built on Flow blockchain that generates yield through integrated staking protocols. Users can place bets on various events while earning passive yield on their positions.

## 🎯 Overview

Trixy Protocol combines prediction markets with DeFi yield generation, allowing users to:
- **Place Bets**: Bet on binary outcomes (YES/NO) of various markets
- **Earn Yield**: Generate passive income through integrated staking protocols (Ankr, Figment, Increment)
- **Track Positions**: Monitor all active and resolved bets in real-time
- **Claim Winnings**: Automatically claim payouts including yield earnings

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Blockchain**: Flow Blockchain (Cadence smart contracts)
- **UI Library**: HeroUI (NextUI fork) with TailwindCSS
- **State Management**: TanStack Query (React Query)
- **Wallet Integration**: @onflow/react-sdk, @onflow/fcl
- **Charts**: Recharts, Lightweight Charts
- **Language**: TypeScript

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── _components/        # Page-specific components
│   │   ├── dashboard.tsx   # Main dashboard with markets
│   │   └── dialog-place-bet.tsx  # Bet placement modal
│   ├── layout.tsx          # Root layout with navbar
│   ├── page.tsx            # Home page
│   └── providers.tsx       # Context providers (Flow, Query, Theme)
├── cadence/                # Cadence smart contracts
│   └── contracts/
│       ├── TrixyProtocol.cdc      # Main protocol contract
│       ├── core/
│       │   ├── Market.cdc         # Market logic
│       │   ├── TrixyTypes.cdc     # Type definitions
│       │   └── TrixyEvents.cdc    # Event definitions
│       └── adapters/              # Staking protocol adapters
│           ├── AnkrAdapter.cdc
│           ├── FigmentAdapter.cdc
│           └── IncrementAdapter.cdc
├── components/             # Reusable UI components
│   ├── carousel/           # Banner carousel
│   ├── chart/              # Chart components (probability, multi-line)
│   ├── search/             # Market search (popover & drawer)
│   ├── flow-provider-wrapper.tsx
│   ├── flow-wallet-connect.tsx
│   └── navbar.tsx
├── hooks/                  # Custom React hooks
│   ├── mutations/
│   │   ├── use-place-bet.ts       # Bet placement mutation
│   │   └── use-claim-winnings.ts  # Winnings claim mutation
│   └── queries/
│       ├── use-market.ts          # Market data queries
│       ├── use-bet.ts             # Bet data queries
│       ├── use-flow-balance.ts    # User balance query
│       └── use-price.ts           # Price feed queries
├── services/               # API service layer
│   ├── market.service.ts   # Market CRUD operations
│   ├── bet.service.ts      # Bet operations
│   ├── flow.service.ts     # Flow blockchain queries
│   └── price.service.ts    # Price feed service
├── lib/                    # Utilities and helpers
│   ├── api-client.ts       # HTTP client wrapper
│   ├── contracts.ts        # Contract addresses
│   └── helper/
│       ├── date.ts         # Date formatting
│       ├── number.ts       # Number formatting
│       └── price.ts        # Price conversions
├── types/                  # TypeScript type definitions
│   ├── market.types.ts
│   ├── bet.types.ts
│   └── protocol.types.ts
└── public/                 # Static assets

```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 10.20.0+
- Flow CLI (for contract deployment)

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Configure Flow network in .env
NEXT_PUBLIC_FLOW_NETWORK=testnet
NEXT_PUBLIC_API_URL=your-backend-api-url
```

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

The app will be available at `http://localhost:3000`

## 🎮 Core Features

### 1. Dashboard
- **Trending Markets**: Browse active markets sorted by TVL
- **Your Positions**: Track all your bets (active & resolved)
- **Pagination**: Navigate through markets efficiently
- **Real-time Updates**: Live probability and TVL updates

### 2. Bet Placement
- **Binary Options**: Choose YES or NO positions
- **Dynamic Odds**: Real-time odds calculation based on market probability
- **Yield Preview**: See estimated yield from staking protocols
- **Balance Check**: Automatic validation of sufficient FLOW balance
- **Transaction Tracking**: View transaction on FlowScan after placement

### 3. Position Management
- **Multi-position Support**: Take both YES and NO positions on same market
- **Win/Loss Tracking**: Clear indicators for resolved markets
- **Claim Winnings**: One-click claim for winning positions (includes yield)
- **Bet History**: Complete history of all placed bets

### 4. Yield Integration
- **Protocol Selection**: Each market uses a specific staking protocol (Ankr, Figment, Increment)
- **Auto-staking**: Funds are automatically staked upon bet placement
- **Yield Calculation**: Real-time yield estimates based on APY and duration
- **Compounded Returns**: Yield + potential winnings calculated together

## 🔗 Flow Blockchain Integration

### Smart Contracts

**Main Contract**: `0x3564db973ae8bb36` (Testnet)

- **TrixyProtocol.cdc**: Core protocol logic, market management
- **Market.cdc**: Individual market logic (bet placement, resolution, claims)
- **Yield Adapters**: Protocol-specific staking integrations

### Transaction Flow

1. **Place Bet**:
   ```cadence
   // User withdraws FLOW -> Market accepts bet -> Funds staked in yield protocol
   transaction(marketCreator: Address, marketId: UInt64, option: String, amount: UFix64)
   ```

2. **Claim Winnings**:
   ```cadence
   // Market calculates payout + yield -> Returns to user
   transaction(marketCreator: Address, marketId: UInt64)
   ```

### Wallet Support

Integrated with Flow wallets via FCL:
- Blocto
- Lilico
- Flow Wallet
- Dapper Wallet

## 🎨 UI Components

- **HeroUI**: Modern, accessible component library
- **Lucide Icons**: Consistent iconography
- **Framer Motion**: Smooth animations
- **Embla Carousel**: Touch-friendly carousels
- **Dark Mode**: Built-in theme switching

## 📊 Data Flow

1. **Frontend** → API Client → **Backend API** → Database
2. **Frontend** → FCL → **Flow Blockchain** (transactions)
3. **Frontend** → Price Service → **External Price Feeds**
4. **Backend** → Flow Event Listener → Market/Bet sync

## 🔧 Configuration

### Flow Network Config (`flow.json`)

```json
{
  "networks": {
    "testnet": "access.devnet.nodes.onflow.org:9000",
    "mainnet": "access.mainnet.nodes.onflow.org:9000"
  },
  "accounts": {
    "testnet-account": {
      "address": "0x3564db973ae8bb36"
    }
  }
}
```

### Environment Variables

```bash
NEXT_PUBLIC_FLOW_NETWORK=testnet        # Flow network (testnet/mainnet)
NEXT_PUBLIC_API_URL=http://localhost:8080  # Backend API URL
```

## 🧪 Development Workflow

### Making Changes

1. **UI Changes**: Edit components in `components/` or `app/`
2. **State Logic**: Update hooks in `hooks/queries` or `hooks/mutations`
3. **Blockchain Calls**: Modify Cadence transactions in hooks
4. **Smart Contracts**: Edit `.cdc` files in `cadence/contracts/`

### Testing

Connect to Flow Testnet and test with test FLOW tokens:
1. Use Flow Faucet for testnet FLOW
2. Connect wallet via navbar
3. Browse markets and place test bets
4. Monitor transactions on FlowScan

## 📝 Key Files

| File | Purpose |
|------|--------|
| `app/_components/dashboard.tsx` | Main market listing and position tracking |
| `app/_components/dialog-place-bet.tsx` | Bet placement modal with yield preview |
| `hooks/mutations/use-place-bet.ts` | Bet placement transaction hook |
| `hooks/mutations/use-claim-winnings.ts` | Winnings claim transaction hook |
| `services/market.service.ts` | Market API operations |
| `lib/contracts.ts` | Contract address configuration |
| `cadence/contracts/TrixyProtocol.cdc` | Main protocol smart contract |

## 🌐 Deployment

The app is configured for deployment on Vercel:

```bash
# Deploy to Vercel
vercel --prod

# Or use Vercel GitHub integration
git push origin main  # Auto-deploys on push
```

Make sure to configure environment variables in Vercel dashboard.

## 🔐 Security

- All transactions require wallet signature
- Smart contracts enforce access controls
- Balance checks prevent over-betting
- Protocol fee (2%) collected on all bets

## 📜 License

See [LICENSE](LICENSE) for details.

## 🤝 Contributing

This is a hackathon project. For production use, additional security audits and testing are recommended.

## 🔗 Links

- **Website**: https://app.trixy.fun
- **GitHub**: https://github.com/TrixyProtocol
- **Twitter**: https://x.com/trixy_fun
- **Email**: support@trixy.fun

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact via email: support@trixy.fun
- Follow updates on Twitter: @trixy_fun
