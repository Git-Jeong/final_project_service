// drawAmPmAvgChart 함수 내에서 echarts 인스턴스를 전역변수로 관리하도록 수정
let amPmChart = null;

//이산화탄소 평균 차트 추가 만들거야

function drawAmPmAvgChart({ xLabels, avgPm1, avgPm25, avgPm10 }, dateStr) {
	//console.log(xLabels);

	const today = new Date();
	const inputDate = new Date(dateStr);

	// 오늘 날짜와 같으면 현재 시간 기준으로 데이터 자르기
	if (
		today.getFullYear() === inputDate.getFullYear() &&
		today.getMonth() === inputDate.getMonth() &&
		today.getDate() === inputDate.getDate()
	) {
		const currentHour = today.getHours();

		// xLabels가 시간 문자열 배열이라 가정 (예: ["00", "01", ..., "23"])
		const cutoffIndex = xLabels.findIndex(label => parseInt(label, 10) > currentHour);

		if (cutoffIndex !== -1) {
			// 시간 초과 구간 데이터는 0으로 채우기
			for (let i = cutoffIndex; i < xLabels.length; i++) {
				avgPm1[i] = null;
				avgPm25[i] = null;
				avgPm10[i] = null;
			}
		}
	}

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
				fontSize: 15,
				padding: [10, 0, 0, 0]
			},
			axisLabel: {
				rotate: 45,
				fontSize: 11,
				fontWeight: 'bold',
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
				fontSize: 11,
				padding: [0, 30, 0, 0]
			},
			axisLabel: {
				fontSize: 14,
				fontWeight: 'bold', // 추가
				color: '#555'
			},
			splitLine: { lineStyle: { color: '#eee' } }
		},
		grid: {
			left: 50,
			right: 50,
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
				lineStyle: { width: 5 }, // 추가
				symbolSize: 8,           // 추가
				markArea: {
					silent: true,
					itemStyle: {
						color: 'rgba(200, 200, 200, 0.3)'
					},
					data: [
						[{ xAxis: 0 }, { xAxis: 6 }],
						[{ xAxis: 19 }, { xAxis: 23 }]
					]
				}
			},
			{
				name: 'PM2.5',
				type: 'line',
				data: avgPm25,
				itemStyle: { color: '#4169E1' },
				smooth: true,
				lineStyle: { width: 5 }, // 추가
				symbolSize: 8            // 추가
			},
			{
				name: 'PM1.0',
				type: 'line',
				data: avgPm1,
				itemStyle: { color: '#8E44AD' },
				smooth: true,
				lineStyle: { width: 5 }, // 추가
				symbolSize: 8            // 추가
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
}, dateStr) {
	const chartDom = document.getElementById('PastCo2denChart');
	if (!chartDom) {
		console.error('PastCo2denChart element not found');
		return;
	}
	if (!amPmCo2denChart) amPmCo2denChart = echarts.init(chartDom);

	const today = new Date();
	const inputDate = new Date(dateStr);

	let option;

	// 오늘 날짜면 데이터 미집계 안내 메시지 표시
	if (
		today.getFullYear() === inputDate.getFullYear() &&
		today.getMonth() === inputDate.getMonth() &&
		today.getDate() === inputDate.getDate()
	) {
		option = {
			title: { text: '오전/오후 평균 이산화탄소', left: 'center' },
			graphic: {
				type: 'group',
				left: 'center',
				top: 'middle',
				children: [
					{
						type: 'text',
						style: {
							text: '아직 하루가 지나지 않아',
							fill: '#666',
							fontSize: 18,
							fontWeight: 'bold',
							align: 'center'
						},
						left: 'center'
					},
					{
						type: 'text',
						style: {
							text: '계산된 데이터가 없습니다.',
							fill: '#666',
							fontSize: 18,
							fontWeight: 'bold',
							align: 'center'
						},
						left: 'center',
						top: 30
					}
				]
			}
	
		};
	} else {
		option = {
			title: { text: '오전/오후 평균 이산화탄소', left: 'center' },
			tooltip: { trigger: 'axis' },
			legend: {
				top: '8%',
				data: ['CO₂ (ppm)'],
				textStyle: { color: '#000000' },
				icon: 'none'
			},
			xAxis: { type: 'category', data: xLabels },
			yAxis: { type: 'value', name: 'ppm' },
			series: [
				{
					name: 'CO₂ (ppm)',
					type: 'bar',
					data: [
						{ value: amAvgCo2den, itemStyle: { color: '#00C3FF' } },
						{ value: pmAvgCo2den, itemStyle: { color: '#FF3CAC' } }
					]
				}
			]
		};
	}

	amPmCo2denChart.setOption(option, { notMerge: true });
	amPmCo2denChart.resize();
	setTimeout(() => {
		amPmCo2denChart.resize();
	}, 200);
}
function drawAmPmCo1denChart({
	xLabels,
	amAvgCoden, pmAvgCoden
}, dateStr) {
	const chartDom = document.getElementById('PastCodenChart');
	if (!chartDom) {
		console.error('PastCo2denChart element not found');
		return;
	}
	if (!amPmCodenChart) amPmCodenChart = echarts.init(chartDom);

	const today = new Date();
	const inputDate = new Date(dateStr);

	let option;

	if (
		today.getFullYear() === inputDate.getFullYear() &&
		today.getMonth() === inputDate.getMonth() &&
		today.getDate() === inputDate.getDate()
	) {
		option = {
			title: { text: '오전/오후 평균 일산화탄소', left: 'center' },
			graphic: {
				type: 'group',
				left: 'center',
				top: 'middle',
				children: [
					{
						type: 'text',
						style: {
							text: '아직 하루가 지나지 않아',
							fill: '#666',
							fontSize: 18,
							fontWeight: 'bold',
							align: 'center'
						},
						left: 'center'
					},
					{
						type: 'text',
						style: {
							text: '계산된 데이터가 없습니다.',
							fill: '#666',
							fontSize: 18,
							fontWeight: 'bold',
							align: 'center'
						},
						left: 'center',
						top: 30
					}
				]
			}

		};
	} else {
		option = {
			title: { text: '오전/오후 평균 일산화탄소', left: 'center' },
			tooltip: { trigger: 'axis' },
			legend: {
				top: '8%',
				data: ['CO (ppm)'],
				textStyle: {
					color: '#000000'
				},
				icon: 'none'
			},
			xAxis: { type: 'category', data: xLabels },
			yAxis: {
				type: 'value',
				name: 'ppm',
				max: '0.2'
			},
			series: [
				{
					name: 'CO (ppm)',
					type: 'bar',
					data: [
						{ value: amAvgCoden, itemStyle: { color: '#1CC8B0' } },
						{ value: pmAvgCoden, itemStyle: { color: '#A259FF' } }
					]
				}
			]
		};
	}

	amPmCodenChart.setOption(option, { notMerge: true });
	amPmCodenChart.resize();
	setTimeout(() => {
		amPmCodenChart.resize();
	}, 200);
}
