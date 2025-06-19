// drawAmPmAvgChart 함수 내에서 echarts 인스턴스를 전역변수로 관리하도록 수정
let amPmChart = null;

//이산화탄소 평균 차트 추가 만들거야

function drawAmPmAvgChart({ xLabels, avgPm1, avgPm25, avgPm10 }) {
	console.log(xLabels);

	const chartDom = document.getElementById('PastDustChart');
	if (!chartDom) {
		console.error('PastDustChart element not found');
		return;
	}

	if (!amPmChart) {
		amPmChart = echarts.init(chartDom);
	}

	const option = {
		title: {
			text: '시간대별 평균 미세먼지',
			left: 'center',
			top: '10px',
			textStyle: {
				fontSize: 18,
				fontWeight: 'bold',
				color: '#333'
			}
		},
		tooltip: {
			trigger: 'axis',
			backgroundColor: '#fff',
			borderColor: '#ccc',
			borderWidth: 1,
			textStyle: {
				color: '#000'
			}
		},
		legend: {
			top: '10%',
			right: '5%',
			textStyle: {
				fontSize: 12,
				color: '#333'
			}
		},
		xAxis: {
			type: 'category',
			data: xLabels,
			name: '시간',
			nameTextStyle: {
				fontWeight: 'bold',
				padding: [10, 0, 0, 0]
			},
			axisLabel: {
				rotate: 45,
				fontSize: 11,
				color: '#555'
			},
			axisLine: { lineStyle: { color: '#ccc' } },
			axisTick: { alignWithLabel: true }
		},
		yAxis: {
			type: 'value',
			name: '㎍/㎥',
			nameTextStyle: {
				fontWeight: 'bold',
				padding: [0, 30, 0, 0]
			},
			axisLabel: { fontSize: 11, color: '#555' },
			splitLine: { lineStyle: { color: '#eee' } }
		},
		grid: {
			left: 60,
			right: 60,
			top: 80,
			bottom: 50
		},
		series: [
			{
				name: 'PM10',
				type: 'line',
				data: avgPm10,
				itemStyle: { color: '#DE2AA6' },
				smooth: true,
				markArea: {
					silent: true,
					itemStyle: {
						color: 'rgba(200, 200, 200, 0.3)' // 연한 회색 배경 (야간)
					},
					data: [
						[
							{ xAxis: 0 },
							{ xAxis: 6 }
						],
						[
							{ xAxis: 19 },
							{ xAxis: 23 }
						]
					]
				}
			},
			{
				name: 'PM2.5',
				type: 'line',
				data: avgPm25,
				itemStyle: { color: '#4169E1' },
				smooth: true
			},
			{
				name: 'PM1.0',
				type: 'line',
				data: avgPm1,
				itemStyle: { color: '#8E44AD' },
				smooth: true
			}
		]
	};


	amPmChart.setOption(option);
	document.getElementById('chartList-loading').style.display = 'none';
	document.getElementById('chartList').style.display = 'block';
	amPmChart.resize();
}

// 리사이즈 이벤트에 amPmChart 인스턴스 resize 호출로 수정
window.addEventListener('resize', () => {
	if (amPmChart) amPmChart.resize();
});


let amPmCo2denChart = null;
let amPmCodenChart = null;

function drawAmPmCo2denChart({
	xLabels,
	amAvgCo2den, pmAvgCo2den
}) {
	const chartDom = document.getElementById('PastCo2denChart');
	if (!chartDom) {
		console.error('PastCo2denChart element not found');
		return;
	}
	if (!amPmCo2denChart) amPmCo2denChart = echarts.init(chartDom);

	const option = {
		title: { text: 'AM/PM 평균 이산화탄소', left: 'center' },
		tooltip: { trigger: 'axis' },
		legend: {
			top: '8%',
			data: ['CO₂ (ppm)']
		},

		xAxis:
			{ type: 'category', data: xLabels },
		yAxis: {
			type: 'value',
			name: 'ppm'
		},
		series: [
			{
				name: 'CO₂ (ppm)',
				type: 'bar',
				data: [
					{
						value: amAvgCo2den,
						itemStyle: { color: '#1A535C' }  // AM 색상
					},
					{
						value: pmAvgCo2den,
						itemStyle: { color: '#FF6B6B' }  // PM 색상
					}
				]
			}
		]

	};

	amPmCo2denChart.setOption(option);
	amPmCo2denChart.resize();
}


function drawAmPmCo1denChart({
	xLabels,
	amAvgCoden, pmAvgCoden
}) {
	const chartDom = document.getElementById('PastCodenChart');
	if (!chartDom) {
		console.error('PastCo2denChart element not found');
		return;
	}
	if (!amPmCodenChart) amPmCodenChart = echarts.init(chartDom);

	const option = {
		title: { text: 'AM/PM 평균 일산화탄소', left: 'center' },
		tooltip: { trigger: 'axis' },
		legend: {
			top: '8%',
			data: ['CO₂ (ppm)']
		},

		xAxis:
			{ type: 'category', data: xLabels },
		yAxis: {
			type: 'value',
			name: 'ppm'
		},
		series: [
			{
				name: 'CO (ppm)',
				type: 'bar',
				data: [
					{
						value: amAvgCoden,
						itemStyle: { color: '#1A535C' }  // AM 색상
					},
					{
						value: pmAvgCoden,
						itemStyle: { color: '#FF6B6B' }  // PM 색상
					}
				]
			}
		]

	};

	amPmCodenChart.setOption(option);
	amPmCodenChart.resize();
}
