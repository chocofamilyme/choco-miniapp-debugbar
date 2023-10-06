export interface ConsoleLog {
	type: 'logs' | 'warn' | 'error';
	log: any[];
	date: Date;
}

export interface NetworkRequest {
	id: string;
	url: string;
	method: string;
	headers: any;
	body?: any;
	response?: any;
	startDate: Date;
	endDate?: Date;
	statusCode?: number;
}
