import { Event, Market } from '../schema/priceHistory';

export const transformEventData = (event: any): Event => {
    return {
      id: event.id,
      slug: event.slug,
      ticker: event.ticker,
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      description: event.description,
      markets: event.markets.map((market: any): Market => ({
          id: market.id,
          question: market.question,
          conditionId: market.conditionId,
          slug: market.slug,
          resolutionSource: market.resolutionSource,
          endDate: market.endDate,
          liquidity: market.liquidity,
          startDate: market.startDate,
          fee: market.fee,
          description: market.description,
          outcomes: market.outcomes,
          outcomePrices: market.outcomePrices,
          volume: market.volume,
          active: market.active,
          marketType: market.marketType,
          closed: market.closed,
          marketMakerAddress: market.marketMakerAddress,
          updatedAt: market.updatedAt,
          wideFormat: market.wideFormat,
          new: market.new,
          featured: market.featured,
          submitted_by: market.submitted_by,
          archived: market.archived,
          resolvedBy: market.resolvedBy,
          restricted: market.restricted,
          groupItemTitle: market.groupItemTitle,
          groupItemThreshold: market.groupItemThreshold,
          questionID: market.questionID,
          enableOrderBook: market.enableOrderBook,
          orderPriceMinTickSize: market.orderPriceMinTickSize,
          orderMinSize: market.orderMinSize,
          volumeNum: market.volumeNum,
          liquidityNum: market.liquidityNum,
          endDateIso: market.endDateIso,
          startDateIso: market.startDateIso,
          hasReviewedDates: market.hasReviewedDates,
          commentsEnabled: market.commentsEnabled,
          volume24hr: market.volume24hr,
          secondsDelay: market.secondsDelay,
          clobTokenIds: market.clobTokenIds,
          acceptingOrders: market.acceptingOrders,
          notificationsEnabled: market.notificationsEnabled,
          creator: market.creator,
          ready: market.ready,
          funded: market.funded,
          competitive: market.competitive,
          pagerDutyNotificationEnabled: market.pagerDutyNotificationEnabled,
          approved: market.approved,
          clobRewards: market.clobRewards,
          spread: market.spread,
          oneDayPriceChange: market.oneDayPriceChange,
          lastTradePrice: market.lastTradePrice,
          bestBid: market.bestBid,
          bestAsk: market.bestAsk,
          automaticallyActive: market.automaticallyActive,
          clearBookOnStart: market.clearBookOnStart,
          priceHistory: market.priceHistory,
      })),
    };
}
