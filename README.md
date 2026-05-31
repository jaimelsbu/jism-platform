# jism-platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`]([https://nextjs.org/docs/app/api-reference/cli/create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app)).

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

## Technical Architecture and Deployment

This platform is built using a modern, serverless edge infrastructure designed for high availability, zero maintenance, and rapid continuous scaling.

Detailed enterprise-grade documentation covering our infrastructure topology, 0-to-1 provisioning ledger, domain management via Cloudflare, and recent production release breakdowns can be found here:

**[Read the JIMS Platform Architecture & Deployment Documentation](./ARCHITECTURE.md)**

### Core Technology Metrics
- **Hosting & Edge Routing:** Vercel Edge Network
- **Security & DNS Proxy:** Cloudflare WAF
- **Database Architecture:** Neon Serverless PostgreSQL (Scale-to-Zero Compute)
- **Communications Engine:** Resend Transactional Email API