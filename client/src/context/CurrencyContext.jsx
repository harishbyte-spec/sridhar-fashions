import React, { createContext, useState, useEffect } from "react";

export const CurrencyContext = createContext();

const INITIAL_CURRENCIES = {
    INR: { code: "INR", symbol: "₹", rate: 1, name: "Indian Rupee" },
    USD: { code: "USD", symbol: "$", rate: 0.012, name: "US Dollar" },
    EUR: { code: "EUR", symbol: "€", rate: 0.011, name: "Euro" },
    GBP: { code: "GBP", symbol: "£", rate: 0.0095, name: "British Pound" },
    AED: { code: "AED", symbol: "AED", rate: 0.044, name: "UAE Dirham" },
};

export const CurrencyProvider = ({ children }) => {
    // Store all available currency data in state so we can update rates
    const [allCurrencies, setAllCurrencies] = useState(INITIAL_CURRENCIES);

    // Track selected currency code
    const savedCode = localStorage.getItem("shopCurrency") || "INR";
    const [currencyCode, setCurrencyCode] = useState(savedCode);

    // Derived active currency object
    const currency = allCurrencies[currencyCode] || allCurrencies.INR;

    // Fetch Live Rates
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await fetch("https://api.exchangerate-api.com/v4/latest/INR");
                const data = await res.json();

                if (data && data.rates) {
                    setAllCurrencies(prev => {
                        const updated = { ...prev };
                        Object.keys(updated).forEach(key => {
                            if (data.rates[key]) {
                                updated[key] = { ...updated[key], rate: data.rates[key] };
                            }
                        });
                        return updated;
                    });
                }
            } catch (error) {
                console.error("Failed to fetch live currency rates:", error);
            }
        };

        fetchRates();
    }, []);

    useEffect(() => {
        localStorage.setItem("shopCurrency", currencyCode);
    }, [currencyCode]);

    const switchCurrency = (code) => {
        if (allCurrencies[code]) {
            setCurrencyCode(code);
        }
    };

    /**
     * Converts generic INR price to selected currency
     * @param {number} priceInINR 
     * @returns {string} Formatted price
     */
    const formatPrice = (priceInINR) => {
        const val = Number(priceInINR) * currency.rate;

        if (currency.code === "INR") {
            return `${currency.symbol}${val.toLocaleString("en-IN")}`;
        }

        return `${currency.symbol}${val.toFixed(2)}`;
    };

    return (
        <CurrencyContext.Provider value={{
            currency,
            switchCurrency,
            formatPrice,
            currencies: Object.values(allCurrencies)
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};
