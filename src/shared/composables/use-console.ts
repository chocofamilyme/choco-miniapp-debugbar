import { reactive } from 'vue';
import { ConsoleLog } from '@/types';

const logs: ConsoleLog[] = reactive([]);
let hasInited = false;

export default function () {
	const init = () => {
		if (hasInited) {
			return;
		}

		const defaultLog = console.log.bind(console);
		const defaultWarn = console.warn.bind(console);
		const defaultError = console.error.bind(console);

		console.log = function (...args) {
			defaultLog.apply(console, args);
			logs.push({
				type: 'logs',
				log: Array.from(args),
				date: new Date()
			});
		};

		console.warn = function (...args) {
			defaultWarn.apply(console, args);
			logs.push({
				type: 'warn',
				log: Array.from(args),
				date: new Date()
			});
		};

		console.error = function (...args) {
			defaultError.apply(console, args);
			logs.push({
				type: 'error',
				log: Array.from(args),
				date: new Date()
			});
		};

		hasInited = true;
	};

	return {
		initConsole: init,
		logs
	};
}
