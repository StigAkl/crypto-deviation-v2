import { Currency } from "../types";

const blacklist: string[] = ["USD", "USDT", "BULL", "BEAR", "SHIT"];
const volumeThreshold = 10000000; 
const defaultDate = new Date(2000, 1, 1); 

interface RawData {
    name: string;
    volumeUsd24h: number; 
};
export const currencyFilter = (currency: RawData): boolean => {
    if(!currency.name.includes("-") && !currency.name.includes("/"))
        return false; 

    if(!currency.name.includes("PERP") && !currency.name.includes("USDT")) return false; 

    const delimiter = currency.name.includes("-") ? "-" : "/"; 

    const name = currency.name.split(delimiter)[0]; 

    if(blacklist.includes(name))
        return false; 


    if(currency.volumeUsd24h < volumeThreshold) return false; 

    return true; 
}

export const currencyMapper = (currency: RawData): Currency => {
    const name = currency.name.includes("-") ? currency.name.split("-")[0] : currency.name.split("/")[0]; 
    
    const mappedCurrency: Currency = {
        lastTriggered15: defaultDate,
        lastTriggeredH: defaultDate,
        lastTriggered4H: defaultDate,
        name,
        marketName: currency.name
    };

    return mappedCurrency;
}

export const removeDuplicates = (currencies: Currency[]): Currency[] => {

    const addedFlags: string[] = [];
    const filteredCurrencies: Currency[] = []; 

    for(let i = 0; i < currencies.length; i++) {
        const currency = currencies[i]; 
        if(!addedFlags.includes(currency.name)) {
            addedFlags.push(currency.name);
            filteredCurrencies.push(currency);  
        }
    }
    
    return filteredCurrencies; 
}