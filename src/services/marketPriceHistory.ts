import { priceHistoryAPI } from "../api/polymarket";
import { probabilityToDecimalOdds } from "../utils/calculations";
export async function getMarketPriceHistory(clobTokenIds: string[], startTs: number, endTs: number) {
  const marketPriceHistoryPromises = clobTokenIds.map(async (tokenId) => {
    const { history } = await priceHistoryAPI({
      market: tokenId,
      startTs,
      endTs,
    });
    history.map((h:any) => {
      h.percent = probabilityToDecimalOdds(h.p)
    })
    return { [tokenId === clobTokenIds[0] ? 'Yes' : 'No']: history };
  });

  return Promise.all(marketPriceHistoryPromises);
}

export function validateMarket(market: any): string[] {
  const clobTokenIds = JSON.parse(market.clobTokenIds);
  if (!Array.isArray(clobTokenIds) || clobTokenIds.length === 0) {
    throw new Error(`No price history found for market ${market.id}`);
  }
  return clobTokenIds;
}

export const convertDateToUnix = (date: Date): number => date.getTime() / 1000;
