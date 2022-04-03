import { Currency } from "../types"

const blacklist: string[] = ["USD, USDT, BULL, BEAR, SHIT"];
const volumeThreshold = 3600000; 

export const currencyFilter = (currency: Currency, volume: number): boolean => {
    if(!currency.marketName.includes("-") && !currency.marketName.includes("/"))
        return false; 

    if(!currency.marketName.includes("PERP") && !currency.marketName.includes("USDT")) return false; 

    const delimiter = currency.marketName.includes("-") ? "-" : "/"; 

    const name = currency.marketName.split(delimiter)[0]; 

    if(blacklist.includes(name))
        return false; 


    if(volume < volumeThreshold) return false; 

    return true; 
}