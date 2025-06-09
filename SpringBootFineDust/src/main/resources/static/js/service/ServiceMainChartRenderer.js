let dustEChart = null;


const drawDustEChart = (dustStack) => {
	const labels = dustStack.map(d => d.timeHms);
	const pm1Data = dustStack.map(d => d.pm1);
	const pm25Data = dustStack.map(d => d.pm25);
	const pm10Data = dustStack.map(d => d.pm10);

	if (!dustEChart) {
		dustEChart = echarts.init(document.getElementById('chart-dust-main-echarts'));
	}

	const option = {
		title: { text: '미세먼지 추이', left: 'center' },
		tooltip: { trigger: 'axis' },
		xAxis: {
			type: 'category',
			data: labels,
			name: '시간'
		},
		yAxis: {
			type: 'value',
			name: '㎍/㎥',
			min: 0
		},
		legend: {
			data: ['PM1', 'PM2.5', 'PM10'],
			top: '10%'
		},
		grid: {
		left: '3%',    // 좌측 여백 (기본값 보통 10~15%)
		right: '5%',   // 우측 여백
		bottom: '8%',  // 아래 여백
		},
		series: [
			{ name: 'PM1', type: 'line', smooth: true, data: pm1Data },
			{ name: 'PM2.5', type: 'line', smooth: true, data: pm25Data },
			{ name: 'PM10', type: 'line', smooth: true, data: pm10Data }
		]
	};

	dustEChart.setOption(option);
};


window.addEventListener('resize', () => {
	if (dustEChart) dustEChart.resize();
});