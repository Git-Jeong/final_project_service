// Chart.js로 선그래프를 그리는 함수
let dustChart = null;

const drawDustChart = (dustStack) => {
	const labels = dustStack.map(d => d.timeHms);
	const pm1Data = dustStack.map(d => d.pm1);
	const pm25Data = dustStack.map(d => d.pm25);
	const pm10Data = dustStack.map(d => d.pm10);

	if (dustChart) {
		dustChart.data.labels = labels;
		dustChart.data.datasets[0].data = pm1Data;
		dustChart.data.datasets[1].data = pm25Data;
		dustChart.data.datasets[2].data = pm10Data;
		dustChart.update();
	} else {
		const ctx = document.createElement('canvas');
		ctx.id = 'chart-dust-main-canvas';
		ctx.className = 'chart-dust-canvas';
		document.getElementById('main-wide-chart').appendChild(ctx);

		dustChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels,
				datasets: [
					{ label: 'PM1', data: pm1Data, borderColor: 'rgba(75,192,192,1)', fill: false },
					{ label: 'PM2.5', data: pm25Data, borderColor: 'rgba(255,99,132,1)', fill: false },
					{ label: 'PM10', data: pm10Data, borderColor: 'rgba(255,206,86,1)', fill: false }
				]
			},
			options: {
				responsive: true,
				scales: {
					x: { title: { display: true, text: '시간' } },
					y: { title: { display: true, text: '농도' }, beginAtZero: true }
				}
			}
		});
	}
};
