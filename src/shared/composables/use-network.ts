import { NetworkRequest } from '@/types';
import { reactive } from 'vue';

const requests: NetworkRequest[] = reactive([]);

export default function () {
	const addRequest = (req: Omit<NetworkRequest, 'startDate'>) => {
		requests.push({
			...req,
			startDate: new Date()
		});
	};

	const addRequestResponseById = (
		id: string,
		statusCode: number,
		res: any
	): boolean => {
		const req = requests.find(r => r.id === id);
		if (req) {
			req.endDate = new Date();
			req.statusCode = statusCode;
			req.response = res;
			return true;
		}

		return false;
	};

	return {
		requests,
		addRequest,
		addRequestResponseById
	};
}
