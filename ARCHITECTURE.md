---

# Technical Architecture & Deployment Documentation

**Project Name:** JIMS Platform (Production: `vektorq.com`)

**Parent Organization:** JIMS Software Inc.

**Classification:** Internal Technical Architecture

**Document Version:** 1.0.0

**Last Updated:** May 2026

---

## 1. Executive Summary & Core Objectives

The JIMS Platform is an enterprise-grade customer insights and analytics application tailored for small local businesses (e.g., salons, restaurants, retail). It delivers complex data analysis—including heatmaps, click-tracking, session replays, and automated drop-off funnels—without the prohibitive cost or technical jargon associated with traditional enterprise tools.

To support a seamless, low-maintenance, and highly scalable footprint, a modern **Serverless/Edge architecture** was designed and deployed.

---

## 2. Infrastructure & System Architecture

The platform utilizes a decoupled, cloud-native stack optimizing for performance, rapid deployments, global distribution, and zero-maintenance overhead.

```
[ User Browser ] ───► [ Cloudflare Edge WAF / DNS ]
                              │
                              ▼
                      [ Vercel Network ] ◄─── (CI/CD via GitHub)
                        (Next.js App)
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
    [ Neon Postgres ]                  [ Resend Email API ]
    (Serverless DB)                    (Transaction/Form Engine)

```

### 2.1 Front-End Framework & Hosting (Vercel)

* **Framework:** Next.js with TypeScript and Tailwind CSS.
* **Hosting Platform:** Vercel (Edge Network).
* **Deployment Workflow:** Continuous Integration / Continuous Deployment (CI/CD) natively hooked into the GitHub repository (`main` branch).
* **Key Benefit:** Every `git push` triggers an isolated micro-build, runs compilation checks, and instantly switches traffic to the new build via atomic deployments with zero down-time.

### 2.2 Domain & Security Layer (Cloudflare)

* **Production Domain:** `vektorq.com`
* **DNS & Proxy Management:** Cloudflare serves as the primary authoritative DNS and reverse-proxy.
* **Security & Optimization:** Full SSL/TLS encryption, automated Global CDN caching, edge optimization, and active web security configurations (bot traffic mitigation and proxy protection).

### 2.3 Serverless Database Layer (Neon)

* **Database Engine:** Neon Serverless PostgreSQL.
* **Architecture:** Decouples compute from storage. Compute instances automatically scale down to zero during idle periods to eliminate running costs, and scale up instantly upon incoming requests.
* **Application Interfacing:** Secure connection pooling enables optimal communication with stateless Next.js Serverless/Edge Functions without exhausting active database connections.

### 2.4 Communication Layer (Resend)

* **Engine:** Resend Email API.
* **Implementation:** Connected directly to the backend lead ingestion points (e.g., the Contact/Discovery Call Form).
* **Key Benefit:** High-deliverability transactional delivery bypassing typical SMTP delays, utilizing modern developer APIs to convert raw form submissions into beautifully structured internal alerts and client confirmations.

---

## 3. Step-by-Step Implementation Ledger (0 to 1)

### Phase 1: Local Engineering & Environment Scaffolding

1. **Repository Setup:** Scaffolded a TypeScript-managed Next.js core application utilizing the modern App Router architecture.
2. **Design System Integration:** Implemented custom Tailwind configurations matching corporate branding tokens (`--color-background`, `--color-primary`, `--color-on-surface-variant`).
3. **Local Tooling:** Configured local development servers and code syntax restrictions via standard linting configurations.

### Phase 2: Database & Third-Party Integration

1. **Neon Provisioning:** Initialized a cloud-hosted Postgres instance on Neon, generated secure environment connection strings, and established schema definitions.
2. **Form Architecture:** Built a decoupled `<ContactForm />` component leveraging asynchronous APIs to post user input natively without reloading pages.
3. **Resend Wiring:** Established a server-side route handler to process incoming lead payloads, validate fields, and execute the Resend SDK to dispatch structured emails seamlessly.

### Phase 3: Cloudflare DNS Alignment

1. **Nameserver Migration:** Transferred domain management over to Cloudflare.
2. **Record Configuration:** Provisioned standard `A` / `CNAME` records pointing custom zones to Vercel's ingress routers while ensuring the Cloudflare proxy toggle (Orange Cloud) remained active for advanced security.

### Phase 4: Production Vercel Onboarding

1. **Project Linking:** Connected Vercel to the GitHub organization repository.
2. **Environment Variable Injection:** Securely injected sensitive server keys (`NEON_DATABASE_URL`, `RESEND_API_KEY`) within Vercel's encrypted setting panel, locking access away from client-facing source code.
3. **Production Domain Mapping:** Configured `vektorq.com` in Vercel, allowing automated issuance of validated SSL certificates across the system network.

---

## 4. Latest Production Release Notes

### **Release Version:** `449fb10`

* **Deployment Handle:** `jism-platform-9i7io4dhl-jaimelsbus-projects.vercel.app`
* **Status:** Live & Fully Operational

#### **Engineering Modifications:**

1. **Mobile UX Upgrade (Hamburger Menu Layout):** Fixed a critical mobile navigation defect. The original implementation relied on a plain text string (`☰`) lacking tap padding and state interactivity.
2. **Architecture Transition:** Upgraded the layout layer with the `'use client';` directive to accommodate dynamic states.
3. **State Engine Integration:** Implemented a robust React `useState` toggle loop (`mobileMenuOpen`) to seamlessly handle the mobile navigation drawer.
4. **SVG Implementation:** Replaced text-based glyphs with highly scalable, sleek custom SVG layout paths representing a modern standard Hamburger bar transitioning smoothly into an "X" close icon.
5. **Ergonomic Enhancements:** Added micro-paddings (`p-2 -mr-2`) achieving a finger-friendly tap target space exceeding standard mobile UX regulations (minimum `44x44px`), eliminating accidental miss-clicks next to surface headers.
6. **Auto-Dismiss Closures:** Bound explicit click listeners to specific navigation anchors so the drawer automatically dismisses itself upon navigating to targeted page sections.

---

## 5. Maintenance, Auditing & Compliance Guidelines

* **Sub-dependency Patching:** During auditing tasks, security warnings regarding deep sub-dependencies (such as internal compiler vulnerabilities in `postcss` within historical bundlers) must **not** be resolved using `npm audit fix --force`. Forceful operations risk breaking Next.js runtime engines. Instead, force clean version overrides safely using the `package.json` `"overrides"` object structure:
```json
"overrides": {
  "postcss": "^8.5.10"
}

```

* **Monitoring:** Real-time health monitoring remains completely automated. Global server availability can be verified through Vercel's integrated Deployment Health metrics.