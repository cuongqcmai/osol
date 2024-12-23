"use client";

import React, { useEffect, useState, memo } from "react";
import imgLogo from "../public/images/66e85bdf146da60e77a5da90_66f6828d1d04ab09cb9049a4_Logo_rotated_coloured_v03-poster-00001.jpg";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

// Define the type for a single crypto object
interface Crypto {
  id: string;
  name: string;
  image: string;
  current_price?: number;
  market_cap?: number;
  market_cap_change_percentage_24h?: number;
  price_change_percentage_24h?: number;
}

// Memoized row component for each cryptocurrency
const CryptoRow = memo(({ crypto }: { crypto: Crypto }) => (
  <tr
    key={crypto.id}
    className="odd:bg-gray-800 even:bg-gray-700 transition duration-300 hover:bg-gray-600"
  >
    <td className="px-4 py-2 flex gap-2">
      <img src={crypto.image} alt={crypto.name} className="w-6 h-6 inline" />
      {crypto.name}
    </td>
    <td className="px-4 py-2">${crypto.current_price?.toFixed(8)}</td>
    <td className="px-4 py-2">${crypto.market_cap?.toLocaleString()}</td>
    <td
      className={`text-center ${
        crypto.market_cap_change_percentage_24h &&
        crypto.market_cap_change_percentage_24h > 0
          ? "text-green-500"
          : "text-red-500"
      }`}
    >
      {crypto.market_cap_change_percentage_24h?.toFixed(2)}%
    </td>
    <td
      className={`px-4 py-2 text-center ${
        crypto.price_change_percentage_24h &&
        crypto.price_change_percentage_24h > 0
          ? "text-green-500"
          : "text-red-500"
      }`}
    >
      {crypto.price_change_percentage_24h?.toFixed(2)}%
    </td>
  </tr>
));

const CryptoTable = () => {
  const [cryptos, setCryptos] = useState<Record<string, Crypto>>({});
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Crypto | null;
    direction: "ascending" | "descending" | null;
  }>({
    key: null,
    direction: null,
  });

  const coinSymbolToID: Record<string, string> = {
    GOAT: "goat",
    IO: "io",
    ACT: "act",
    // Add all other coin symbols here
    // ...
  };

  // Define the type for the CoinGecko API response
  interface CoinGeckoResponse {
    id: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_change_percentage_24h: number;
    price_change_percentage_24h: number;
  }

  const fetchCoins = async () => {
    try {
      const coinIDs = Object.values(coinSymbolToID).join(",");
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIDs}`
      );
      const data: CoinGeckoResponse[] = await response.json();

      const updatedData: Record<string, Crypto> = { ...cryptos };

      data.forEach((coin) => {
        if (
          !cryptos[coin.id] ||
          JSON.stringify(cryptos[coin.id]) !== JSON.stringify(coin)
        ) {
          updatedData[coin.id] = {
            id: coin.id,
            name: coin.name,
            image: coin.image,
            current_price: coin.current_price,
            market_cap: coin.market_cap,
            market_cap_change_percentage_24h:
              coin.market_cap_change_percentage_24h,
            price_change_percentage_24h: coin.price_change_percentage_24h,
          };
        }
      });

      setCryptos(updatedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCoins(); // Initial fetch
    const interval = setInterval(fetchCoins, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const sortedCryptos = React.useMemo(() => {
    const items = Object.values(cryptos); // Convert object to array
    if (sortConfig.key) {
      items.sort((a, b) => {
        const value = sortConfig.key || null;
        if (!value || !a[value] || !b[value]) return 0;
        const aValue = a[value];
        const bValue = b[value];
        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [cryptos, sortConfig]);

  const handleSort = (key: keyof Crypto) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        return {
          key,
          direction:
            prevConfig.direction === "ascending" ? "descending" : "ascending",
        };
      }
      return { key, direction: "ascending" };
    });
  };

  const getSortIcon = (key: keyof Crypto) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div className="w-full bg-gray-900 text-white p-6 flex justify-center items-center">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Cryptocurrency Dashboard
        </h1>
        {loading ? (
          <div className="text-center text-lg animate-pulse">Loading...</div>
        ) : (
          <table
            style={{
              backgroundImage: `url(${imgLogo?.src})`, // Ensure the image URL is correct
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
            className="w-full table-auto border-collapse overflow-hidden shadow-lg rounded-lg bg-gray-800"
          >
            <thead className="bg-gray-700">
              <tr>
                <th
                  className="gap-2 px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <p className="flex items-center">
                    Agent {getSortIcon("name")}
                  </p>
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("current_price")}
                >
                  <p className="flex items-center">
                    Price {getSortIcon("current_price")}
                  </p>
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("market_cap")}
                >
                  <p className="flex items-center">
                    Marketcap {getSortIcon("market_cap")}
                  </p>
                </th>
                <th
                  className="px-4 py-2 text-center cursor-pointer"
                  onClick={() => handleSort("market_cap_change_percentage_24h")}
                >
                  <p className="flex items-center">
                    Marketcap Change 24h{" "}
                    {getSortIcon("market_cap_change_percentage_24h")}
                  </p>
                </th>
                <th
                  className="px-4 py-2 text-center cursor-pointer"
                  onClick={() => handleSort("price_change_percentage_24h")}
                >
                  <p className="flex items-center">
                    % Change 24h {getSortIcon("price_change_percentage_24h")}
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCryptos.map((crypto) => (
                <CryptoRow key={crypto.id} crypto={crypto} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CryptoTable;
