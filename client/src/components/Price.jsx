import React, { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";

const Price = ({ amount, style }) => {
    const { formatPrice } = useContext(CurrencyContext);

    if (amount === undefined || amount === null) return null;

    return <span style={style}>{formatPrice(amount)}</span>;
};

export default Price;
