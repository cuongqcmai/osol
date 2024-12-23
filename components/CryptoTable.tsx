"use client";

import React, { useEffect, useState, memo } from "react";
import imgLogo from "../public/images/66e85bdf146da60e77a5da90_66f6828d1d04ab09cb9049a4_Logo_rotated_coloured_v03-poster-00001.jpg";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const CryptoRow = memo(({ crypto }) => (
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
        crypto.market_cap_change_percentage_24h > 0
          ? "text-green-500"
          : "text-red-500"
      }`}
    >
      {crypto.market_cap_change_percentage_24h?.toFixed(2)}%
    </td>
    <td
      className={`px-4 py-2 text-center ${
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
  const [cryptos, setCryptos] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const coinSymbolToID = {
    GOAT: "goat",
    IO: "io",
    ACT: "act",
    ZEREBRO: "zerebro",
    NOS: "nos",
    GRIFFAIN: "griffain",
    TAI: "tai",
    ARC: "arc",
    ELIZA: "eliza",
    ALCH: "alch",
    MEMESAI: "memesai",
    DEGENAI: "degenai",
    VVAIFU: "vvaifu",
    BULLY: "bully",
    KWEEN: "kween",
    GRIFT: "grift",
    FXN: "fxn",
    HAT: "hat",
    SHOGGOTH: "shoggoth",
    TANK: "tank",
    WORM: "worm",
    DRUGS: "drugs",
    BONGO: "bongo",
    GNON: "gnon",
    AVA: "ava",
    OPUS: "opus",
    OBOT: "obot",
    PROJECT89: "project89",
    CHAOS: "chaos",
    MEOW: "meow",
    KOKO: "koko",
    KHAI: "khai",
    PIPPIN: "pippin",
    MAX: "max",
    AIMONICA: "aimonica",
    AVB: "avb",
    FOREST: "forest",
    SOLARIS: "solaris",
    SNS: "sns",
    MOE: "moe",
    UBC: "ubc",
    MIZUKI: "mizuki",
    NAI: "nai",
    FATHA: "fatha",
    CABAL: "cabal",
    TNSR: "tnsr",
    AROK: "arok",
    SHEGEN: "shegen",
    SPERG: "sperg",
    OMEGA: "omega",
    THALES: "thales",
    KEKE: "keke",
    $HORNY: "horny",
    QUASAR: "quasar",
    ROPIRITO: "ropirito",
    KOLIN: "kolin",
    KWANT: "kwant",
    DITH: "dith",
    DUCKAI: "duckai",
    CENTS: "cents",
    IQ: "iq",
    BINARY: "binary",
    WMM: "wmm",
    YOUSIM: "yousim",
    SENSUS: "sensus",
    OCADA: "ocada",
    SINGULARRY: "singularry",
    NAVAL: "naval",
    KIRA: "kira",
    KRA: "kra",
    BROT: "brot",
    "E/ACC": "eacc",
    GRIN: "grin",
    LIMBO: "limbo",
    SIZE: "size",
    NEROBOSS: "neroboss",
    GMIKA: "gmika",
    CONVO: "convo",
    SQR: "sqr",
    UGLYDOG: "uglydog",
    GEMXBT: "gemxbt",
    RM9000: "rm9000",
    NOVA: "nova",
    SENDOR: "sendor",
    FLOWER: "flower",
    DOAI: "doai",
    $INTERN: "intern",
    DEVIN: "devin",
    LEA: "lea",
    REX: "rex",
    ALETHEIA: "aletheia",
    MONA: "mona",
    API: "api",
    "42": "42",
    LUCY: "lucy",
    ROGUE: "rogue",
  };

  const fetchCoins = async () => {
    try {
      const coinIDs = Object.values(coinSymbolToID).join(",");
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIDs}`
      );
      const data = await response.json();
      const updatedData = { ...cryptos };

      data.forEach((coin) => {
        if (
          !cryptos[coin.id] ||
          JSON.stringify(cryptos[coin.id]) !== JSON.stringify(coin)
        ) {
          updatedData[coin.id] = coin;
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
    const interval = setInterval(fetchCoins, 10000); // Fetch every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const sortedCryptos = React.useMemo(() => {
    const items = Object.values(cryptos); // Convert object to array
    if (sortConfig.key) {
      items.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [cryptos, sortConfig]);

  const handleSort = (key) => {
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

  const getSortIcon = (key) => {
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
              backgroundImage: `url(${imgLogo?.src})`, // Replace with your image URL
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
            className="w-full table-auto border-collapse overflow-hidden shadow-lg rounded-lg bg-gray-800"
          >
            <thead className="bg-gray-700">
              <tr>
                <th
                  className=" gap-2 jus px-4 py-2 text-left cursor-pointer"
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
