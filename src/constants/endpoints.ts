module.exports = {
  GET_FUTURE: (future) => process.env.API_ROOT.concat(`/futures/${future}`),
  GET_MARKETS: (): string => process.env.API_ROOT.concat("/markets"),
  GET_CANDLES: (market, resolution) =>
    process.env.API_ROOT.concat(
      `/markets/${market}/candles?resolution=${resolution}`
    ),
};
