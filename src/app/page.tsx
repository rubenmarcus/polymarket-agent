import React from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Polymarket AI Agent</h1>
      <p className="mb-4">
        Welcome to the Polymarket AI Agent. This agent provides a comprehensive API for interacting with Polymarket prediction markets.
      </p>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Features</h2>
        <ul className="list-disc pl-5">
          <li>Market data retrieval</li>
          <li>Market analysis</li>
          <li>Transaction capabilities</li>
        </ul>
      </div>
      <p className="mb-4">
        For more information, please refer to the documentation.
      </p>
    </div>
  );
}
