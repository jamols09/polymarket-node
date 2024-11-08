import { priceHistoryAPI } from "../api/polymarket";
import { transformEventData } from "../helpers/priceHistoryHelper";
import { probabilityToDecimalOdds } from "../utils/calculations";

export const getMarketPriceHistory = async (clobTokenIds: string[], startTs: number, endTs: number) => {
  const marketPriceHistoryPromises = clobTokenIds.map(async (tokenId) => {
    try {
      const response = await priceHistoryAPI({
        market: tokenId,
        startTs,
        endTs,
      });
      const { history } = response;

      if (!history || history.length === 0) {
          console.warn(`No history found for tokenId ${tokenId}`);
      }

      history.forEach((h: any) => {
          h.percent = probabilityToDecimalOdds(h.p);
      });

      return { [tokenId === clobTokenIds[0] ? 'Yes' : 'No']: history };
  } catch (error) {
      console.error(`Failed to fetch price history for tokenId ${tokenId}:`, error);
      return { [tokenId === clobTokenIds[0] ? 'Yes' : 'No']: [] };
  }
});

  const marketPriceHistory = await Promise.all(marketPriceHistoryPromises);
  return marketPriceHistory;
};



export function validateMarket(market: any): string[] {
  const clobTokenIds = JSON.parse(market.clobTokenIds);
  if (!Array.isArray(clobTokenIds) || clobTokenIds.length === 0) {
    throw new Error(`No price history found for market ${market.id}`);
  }
  return clobTokenIds;
}

export const convertDateToUnix = (date: Date): number => date.getTime() / 1000;


export const formatPriceHistory = async(event: any) => {
  for (const market of event.markets) {
    if (!market.clobTokenIds) {
      continue;
    }
    try {
      const clobTokenIds = validateMarket(market);
      const startTs = convertDateToUnix(new Date(market.startDateIso));
      const endTs = convertDateToUnix(new Date(market.endDateIso));
      // Fetch and assign price history data
      market.priceHistory = await getMarketPriceHistory(clobTokenIds, startTs, endTs);
    } catch (error) {
      console.error(`Error fetching price history for market ${market.id}:`, error);
      market.priceHistory = 'Error fetching price history';
    }
  }
  return transformEventData(event);
}