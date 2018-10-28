import { helper as buildHelper } from '@ember/component/helper';

export function secondsDiff(params) {
	var value = parseInt(params[0] - params[1]);
	if (value < 0) {
		return '0 s';
	}
	if (value < 60) {
		return value + ' s';
	}

	var m = parseInt(value / 60);
	if (m < 60) {
		var s = value % 60;
		return m + ' m ' + s + ' s';
	}
	var h = parseInt(m / 60);
	m = m % 60;
	return h + ' h ' + m + ' m';
}

export default buildHelper(secondsDiff);
