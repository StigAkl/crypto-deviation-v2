export interface Currency {
  marketName: string;
  name: string;
  lastTriggered15: Date;
  lastTriggeredH: Date;
  lastTriggered4H: Date;
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

export enum Timeframe {
  EveryFifteenMinute = 900,
  Hourly = 3600,
  EveryFourthHour = 14400
}
