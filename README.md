This repository contains the frontend code of the project. The corresponding backend repository can be found at the following link: https://github.com/Kaimuuuu/muu

The backend repository contains all of the necessary code to build and run the API for the project. It is built using Golang and is accessed by the frontend through API calls.

# Project Overview
This project is a platform that allows the 'client' to view the menu and order food, while the 'admin,' 'chef,' and 'waiter' can interact with the system depending on the use cases.

The following use cases are available to users:

Client:

- Scan the QR code to enter the landing page.
- View the menu items depending on the selected promotion (each promotion has a different menu list).
- Order food.
- Cannot order when the order exceeds the weight limit (this prevents the order from bottlenecking the entire system when the order is too large, in other words, if it has many foods in one order).
- View their own ordering history; they can also view the order status, either declined or successful, and the total price of ordered foods.
- View recommended foods (foods suggested based on order count).

Waiter:

- Log in and log out of their account.
- View a list of available promotions.
- Generate QR Code for new clients.
- View the list of QR Codes.
- Checkout.

Chef:

- Log in and log out of their account.
- View a list of pending orders.
- Update order status (success or declined).
- View a list of menus and also update menu item status to out of stock to prevent clients from ordering.

Admin:

- Log in and log out of their account.
- Create/View/Update/Delete the list of employees.
- Create/View/Update/Delete the list of menus.
- Create/View/Update/Delete the list of promotions.
- Update order status (success or declined).
- View the list of QR Codes.
- Checkout.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
