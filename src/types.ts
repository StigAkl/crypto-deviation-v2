export interface Currency {
  name: string;
  lastTriggered: Date;
}

export interface Candle {
  open: number;
  close: number;
  typicalPrice: number;
  low: number;
  high: number;
}

export interface BolingerBands {
  upperBollingerBand: number;
  lowerBollingerBand: number;
  currentPrice: number;
  currentCrossingBollingerLevel: number;
}
