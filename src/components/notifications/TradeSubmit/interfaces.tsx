export interface ITradeNotificationErrorProps {
	success: boolean
	message: string
	minStake?: number
	maxStake?: number
}

export interface ITradeNotificationSuccessProps {
	timeout?: any
	allowTimedCancel?: boolean
	tradeID?: number
	success?: true
}

export interface PnlNotificationProps {
	amount: number
	profit: number
}
