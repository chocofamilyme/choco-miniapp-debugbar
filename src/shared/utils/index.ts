export const getDate = (date: Date) => {
	let hours = date.getHours().toString();
	let minutes = date.getMinutes().toString();
	let seconds = date.getSeconds().toString();

	if (hours.length === 1) {
		hours = '0' + hours;
	}

	if (minutes.length === 1) {
		minutes = '0' + minutes;
	}

	if (seconds.length === 1) {
		seconds = '0' + seconds;
	}

	return [hours, minutes, seconds].join(':');
};
