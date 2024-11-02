interface PriceHistory {
  t: number; 
  p: number;
  percent: number;
}

interface OutcomePriceHistory {
  Yes?: PriceHistory[];
  No?: PriceHistory[];
}

interface ClobReward {
  id: string;
  conditionId: string;
  assetAddress: string;
  rewardsAmount: number;
  rewardsDailyRate: number;
  startDate: string;
  endDate: string;
}

export interface Market {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  resolutionSource: string;
  endDate: string;
  liquidity: string;
  startDate: string;
  fee: string;
  description: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  active: boolean;
  marketType: string;
  closed: boolean;
  marketMakerAddress: string;
  updatedAt: string;
  wideFormat: boolean;
  new: boolean;
  featured: boolean;
  submitted_by: string;
  archived: boolean;
  resolvedBy: string;
  restricted: boolean;
  groupItemTitle: string;
  groupItemThreshold: string;
  questionID: string;
  enableOrderBook: boolean;
  orderPriceMinTickSize: number;
  orderMinSize: number;
  volumeNum: number;
  liquidityNum: number;
  endDateIso: string;
  startDateIso: string;
  hasReviewedDates: boolean;
  commentsEnabled: boolean;
  volume24hr: number;
  secondsDelay: number;
  clobTokenIds: string;
  acceptingOrders: boolean;
  notificationsEnabled: boolean;
  creator: string;
  ready: boolean;
  funded: boolean;
  competitive: number;
  pagerDutyNotificationEnabled: boolean;
  approved: boolean;
  clobRewards: ClobReward[];
  spread: number;
  oneDayPriceChange: number;
  lastTradePrice: number;
  bestBid: number;
  bestAsk: number;
  automaticallyActive: boolean;
  clearBookOnStart: boolean;
  priceHistory: OutcomePriceHistory[];
}

export interface Event {
  id: string;
  slug: string;
  ticker: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  markets: Market[];
}
