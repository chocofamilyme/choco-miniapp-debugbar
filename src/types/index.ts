export interface ConsoleLog {
	type: 'logs' | 'warn' | 'error';
	log: any[];
	date: Date;
}
