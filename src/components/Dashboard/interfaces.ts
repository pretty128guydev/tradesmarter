export interface IDashboardTrade {
	highCount: number
	highVolume: number
	lowCount: number
	lowVolume: number
}

export interface IDashboardBonus {
	totalBonusReceived: number
	totalTradedVolume: number
}

export interface IDashboardTradeDate {
	dates: {
		[key: string]: IDashboardTrade
	}
}

export interface IDashboardTradeInstrument {
	closedTrades: { [key: string]: IDashboardTrade }
	openedTrades: { [key: string]: IDashboardTrade }
}

export interface IDashboardTrades {
	byDateWithOffset: IDashboardTradeDate
	byInstrumentId: IDashboardTradeInstrument
}

export interface IDashboardData {
	walletStats: {
		bonus: IDashboardBonus
		trade: IDashboardTrade
	}
}
