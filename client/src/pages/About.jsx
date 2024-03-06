import React from "react";
import { Header } from "../components";

export default function About() {
  return (
    <div className="m-2 my-14 flex h-5/6 flex-col rounded-3xl bg-white p-2 md:mx-10 md:mt-4 md:px-8 md:pt-8">
      <div className="flex flex-col items-start justify-between gap-2 overflow-y-auto">
        <Header category="Info" title="About" />
        <p>
          <b>ScouterAI</b> is your all-in-one solution for managing your
          cryptocurrency portfolios. Whether you’re a seasoned investor or just
          dipping your toes into the crypto world, our user-friendly app
          simplifies the process of tracking and monitoring your digital assets.
        </p>
        <h2 className="text-2xl font-semibold">Key Features:</h2>
        <ol className="pl-4">
          <li>
            <b>1. Wallet Tracking Made Easy</b>: Say goodbye to juggling
            multiple wallets across various platforms. ScouterAI consolidates
            all your cryptocurrency holdings into one convenient dashboard.
            Monitor your balances, transactions, and performance effortlessly.
          </li>
          <li>
            <b>2. Real-Time Notifications</b>: Stay informed with instant
            alerts. Receive updates on price fluctuations, deposits, and
            withdrawals directly to your device. No more missing out on critical
            market movements.
          </li>
          <li>
            <b>3. Personalized Nicknames</b>: Tired of deciphering wallet
            addresses? ScouterAI lets you assign custom nicknames to your
            wallets. Whether it’s “Savings Stash” or “Trading Vault,” you’ll
            recognize your holdings at a glance.
          </li>
        </ol>
        <h2 className="text-2xl font-semibold">In Development Features</h2>
        <ol className="pl-4">
          <li>
            <b>1. Integrated AI for Token Auditing</b>: We’re working hard to
            integrate advanced artificial intelligence directly into ScouterAI.
            Soon, you’ll be able to automatically audit the tokens you’ve
            purchased. Our AI will analyze token contracts, verify legitimacy,
            and provide insights into potential risks. Say goodbye to manual
            research – let ScouterAI do the heavy lifting for you!
          </li>
          <li>
            <b>2. Telegram Bot Integration</b>: For those who prefer tracking
            their crypto investments on Telegram, we’ve got you covered. Our
            upcoming Telegram bot will allow you to manage your portfolios,
            receive real-time alerts, and even execute basic commands – all
            within your favorite messaging app. Stay connected and informed
            wherever you go!
          </li>
          <li>
            <b>3. Solana and Multi-Blockchain Support</b>: Diversification
            matters, and we’re expanding our horizons. ScouterAI will soon
            support Solana (SOL) and other prominent blockchains. Whether you’re
            a DeFi enthusiast or exploring NFTs, our platform will seamlessly
            integrate with various networks, ensuring you never miss out on
            emerging opportunities.
          </li>
        </ol>
        <h2 className="text-2xl font-semibold">Our Mission:</h2>
        <p>
          At ScouterAI, we believe that managing cryptocurrencies should be
          accessible to everyone. Our mission is to empower users by providing a
          seamless experience, whether you’re a crypto enthusiast or a curious
          beginner. Join us on this exciting journey as we navigate the crypto
          landscape together!
        </p>
      </div>
    </div>
  );
}
