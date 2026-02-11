# Sole Shoes

Premium footwear for the modern era.

Sole Shoes is a high-performance e-commerce platform designed to deliver an exceptional shopping experience. Built with a focus on speed, aesthetics, and user interaction, it combines cutting-edge web technologies with a minimalist design philosophy.

## Features

**Immersive Interface**
A fluid, responsive design powered by GSAP animations and Framer Motion transitions creates a seamless browsing experience.

**Real-Time Inventory**
Live stock tracking and dynamic product updates ensure customers always have accurate information.

**Secure Authentication**
Robust user management system with secure password hashing and email verification protocols.

**Streamlined Checkout**
Integrated Stripe payment processing for secure, frictionless transactions.

**Enhanced Search**
Global fuzzy search capabilities allow users to find products instantly.

## Technology Stack

The platform is architected using a modern, scalable stack:

- **Frontend:** Next.js 15 (App Router), React, TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **Backend:** Convex (Real-time database & functions)
- **Payments:** Stripe
- **Animation:** GSAP, Framer Motion
- **Form Handling:** React Hook Form, Zod

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/sole-shoes.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   Create a `.env.local` file with the required keys:
   ```bash
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   STRIPE_SECRET_KEY=your_stripe_secret
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

   Open http://localhost:3000 to view the application.

## License

This project is licensed under the MIT License.
