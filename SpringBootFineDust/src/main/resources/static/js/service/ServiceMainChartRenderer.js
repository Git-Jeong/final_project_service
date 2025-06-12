let dustEChart = null;
let pm1EChart = null;
let pm25EChart = null;
let pm10EChart = null;

let codenEChart = null;
let co2denEChart = null;

const updateAirQualitySignal = (data) => {
	const signals = [
		{ type: 'pm1.0', value: data.pm1 },
		{ type: 'pm2.5', value: data.pm25 },
		{ type: 'pm10', value: data.pm10 }
	];

	signals.forEach(({ type, value }) => {
		// 숫자 표시

		const pmValueElem = document.querySelector(`.serviceChart-air-quality-box [data-type="${type}"]`).previousElementSibling.querySelector('.pm-value');
		if (pmValueElem) pmValueElem.textContent = value;

		// 색상 및 상태 문구 설정
		const qualityBox = document.querySelector(`.serviceChart-quality[data-type="${type}"]`);
		if (!qualityBox) return;


		let colorClass = '';
		let statusText = '';

		// 한국 기준 색상 및 상태 (pm1, pm2.5, pm10 각각 분리)
		if (type === 'pm1.0') {
			if (value > 50) {
				colorClass = 'red';
				statusText = '매우 나쁨';
			} else if (value > 35) {
				colorClass = 'orange';
				statusText = '나쁨';
			} else if (value > 15) {
				colorClass = 'green';
				statusText = '보통';
			} else {
				colorClass = 'blue';
				statusText = '좋음';
			}
		} else if (type === 'pm2.5') {
			if (value > 75) {
				colorClass = 'red';
				statusText = '매우나쁨';
			} else if (value > 35) {
				colorClass = 'orange';
				statusText = '나쁨';
			} else if (value > 15) {
				colorClass = 'green';
				statusText = '보통';
			} else {
				colorClass = 'blue';
				statusText = '좋음';
			}
		} else if (type === 'pm10') {
			if (value > 150) {
				colorClass = 'red';
				statusText = '매우 나쁨';
			} else if (value > 80) {
				colorClass = 'orange';
				statusText = '나쁨';
			} else if (value > 30) {
				colorClass = 'green';
				statusText = '보통';
			} else {
				colorClass = 'blue';
				statusText = '좋음';
			}
		}

		// 기존 클래스 제거 후 새로운 색상 클래스 추가
		qualityBox.classList.remove('red', 'orange', 'green', 'blue');
		qualityBox.classList.add(colorClass);

		// 상태 문구 삽입 (기존 텍스트 모두 제거 후 삽입)
		qualityBox.textContent = statusText;
	});
};

const drawDustMainEChart = ({ timeHms: labels, pm1Data, pm25Data, pm10Data }) => {

	if (!dustEChart) {
		dustEChart = echarts.init(document.getElementById('chart-dust-main-echarts'));
	}

	const option = {
		title: [
			{
				text: '미세먼지 추이',
				left: 'center'
			}
		],
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
			data: ['PM1.0', 'PM2.5', 'PM10'],
			top: 5,
			left: 20
		},
		grid: {
			left: 50,
			right: 50,
			top: 70,
			bottom: 30
		},
		series: [
			{ name: 'PM1.0', type: 'line', smooth: true, data: pm1Data, itemStyle: { color: '#8e44ad' } },
			{ name: 'PM2.5', type: 'line', smooth: true, data: pm25Data, itemStyle: { color: '#4169E1' } },
			{ name: 'PM10', type: 'line', smooth: true, data: pm10Data, itemStyle: { color: '#DE2AA6' } }
		],
		graphic: {
			elements: [
				{
					type: 'text',
					right: 20,
					top: 5,
					style: {
						text: '미세먼지 기준 ⓘ',
						fill: '#777777',
						font: 'bold 14px sans-serif',
						cursor: 'pointer',
					},
					tooltip: {
						show: true,
						formatter: () => {
							const style = `
						      <style>
						        .dust-table {
								  border-collapse: collapse;
								  width: auto;
								  min-width: 500px;
								  font-size: 12px;
								  margin-top: 6px;
								  table-layout: fixed;
								}
								.dust-table th, .dust-table td {
								  border: 1px solid #ccc;
								  padding: 6px 4px;
								  text-align: center;
								  word-wrap: break-word;
								}
						        .dust-table th {
						          font-weight: bold;
								  width : 50px;
						        }
								.dust-table-list{
									background : #f5f7ff;
									color : #000000;
								}
						        .dust-table-blue {
									background : #1c8bf3;
						        }
						        .dust-table-green {
									background : #0aa953;
						        }
						        .dust-table-orange {
									background : #ffa70c;
						        }
						        .dust-table-red {
									background : #f34545;
						        }
						        .dust-table-blue,
						        .dust-table-green,
						        .dust-table-orange,
						        .dust-table-red {
									color : #ffffff;
						        }
						        .dust-table tr:nth-child(even) {
						          background: #f5f7ff;
						        }
								.dust-table-bold{
									font-weight: bold;	
								}
								.dust-info-text{
									color : #777777;
									font-weight: bold;	
									font-size: 12px;
								}
						      </style>
						    `;
							const table = `
							      <table class="dust-table">
							        <thead>
							          <tr>
							            <th class="dust-table-list">미세먼지 기준</th>
							            <th class="dust-table-blue">좋음</th>
							            <th class="dust-table-green">보통</th>
							            <th class="dust-table-orange">나쁨</th>
							            <th class="dust-table-red">매우 나쁨</th>
							          </tr>
							        </thead>
							        <tbody>
							          <tr>
							            <td class="dust-table-bold">PM10 (㎍/㎥)</td>
							            <td>0 ~ 30</td>
							            <td>31 ~ 80</td>
							            <td>81 ~ 150</td>
							            <td>151 이상</td>
							          </tr>
							          <tr>
							            <td class="dust-table-bold">PM2.5 (㎍/㎥)</td>
							            <td>0 ~ 15</td>
							            <td>16 ~ 35</td>
							            <td>36 ~ 75</td>
							            <td>76 이상</td>
							          </tr>
							          <tr>
							            <td class="dust-table-bold">PM1.0 (㎍/㎥)</td>
							            <td>0 ~ 15</td>
							            <td>16 ~ 35</td>
							            <td>36 ~ 50</td>
							            <td>51 이상</td>
							          </tr>
							        </tbody>
							      </table>
								  <span class="dust-info-text">ⓘ PM1.0은 별도 기준이 없어서 임의로 지정함.</<span>
							    `;
							return style + table;
						},
						position: 'bottom',
						enterable: true,
					}
				}
			]
		}
	};

	dustEChart.setOption(option);
};

const drawDustPm1EChart = ({ timeHms, pm1Data }) => {
	const container = document.getElementById('mini-pm1-chart');
	if (!container) return;

	if (!pm1EChart) {
		pm1EChart = echarts.init(container);
	}

	const option = {
		tooltip: {
			trigger: 'axis'
		},
		title: {
			text: `${pm1Data.at(-1)} ㎍/㎥`,
			right: 10,
			top: 0,
			textStyle: {
				fontSize: 14,
				color: '#333'
			}
		},
		xAxis: {
			type: 'category',
			data: timeHms,
			boundaryGap: false,
			axisLine: { onZero: false }
		},
		yAxis: {
			type: 'value',
			name: '㎍/㎥'
		},
		grid: {
			left: 30,
			right: 30,
			bottom: 20,
			top: 30
		},
		series: [{
			name: 'PM1.0',
			type: 'line',
			data: pm1Data,
			smooth: true,
			itemStyle: { color: '#8e44ad' }
		}]
	};

	pm1EChart.setOption(option);
	pm1EChart.resize();
}


const drawDustPm25EChart = ({ timeHms, pm25Data }) => {
	const container = document.getElementById('mini-pm25-chart');
	if (!container) return;

	if (!pm25EChart) {
		pm25EChart = echarts.init(container);
	}

	const option = {
		tooltip: {
			trigger: 'axis'
		},
		title: {
			text: `${pm25Data.at(-1)} ㎍/㎥`,
			right: 10,
			top: 0,
			textStyle: {
				fontSize: 14,
				color: '#333'
			}
		},
		xAxis: {
			type: 'category',
			data: timeHms,
			boundaryGap: false,
			axisLine: { onZero: false }
		},
		yAxis: {
			type: 'value',
			name: '㎍/㎥'
		},
		grid: {
			left: 30,
			right: 30,
			bottom: 20,
			top: 30
		},
		series: [{
			name: 'PM25',
			type: 'line',
			data: pm25Data,
			smooth: true,
			itemStyle: { color: '#4169E1' }
		}]
	};

	pm25EChart.setOption(option);
	pm25EChart.resize();
}


const drawDustPm10EChart = ({ timeHms, pm10Data }) => {
	const container = document.getElementById('mini-pm10-chart');
	if (!container) return;

	if (!pm10EChart) {
		pm10EChart = echarts.init(container);
	}

	const option = {
		tooltip: {
			trigger: 'axis'
		},
		title: {
			text: `${pm10Data.at(-1)} ㎍/㎥`,
			right: 10,
			top: 0,
			textStyle: {
				fontSize: 14,
				color: '#333'
			}
		},
		xAxis: {
			type: 'category',
			data: timeHms,
			boundaryGap: false,
			axisLine: { onZero: false }
		},
		yAxis: {
			type: 'value',
			name: '㎍/㎥'
		},
		grid: {
			left: 30,
			right: 30,
			bottom: 20,
			top: 30
		},
		series: [{
			name: 'PM10',
			type: 'line',
			data: pm10Data,
			smooth: true,
			itemStyle: { color: '#DE2AA6' }
		}]
	};

	pm10EChart.setOption(option);
	pm10EChart.resize();
}

const drawCodenChart = (codenChartData) => {
	const container = document.getElementById('mini-co-chart');
	if (!container) return;

	if (!codenEChart) {
		codenEChart = echarts.init(container);
	}

	const option = {
		tooltip: {
			trigger: 'axis'
		},
		title: {
			text: `${codenChartData.codenData.at(-1).toFixed(2)} ppm`,
			right: 10,
			top: 0,
			textStyle: {
				fontSize: 14,
				color: '#333'
			}
		},
		xAxis: {
			type: 'category',
			data: codenChartData.timeHms,
			boundaryGap: false,
			axisLine: { onZero: false }
		},
		yAxis: {
			type: 'value',
			name: 'ppm',
			min: parseFloat((Math.max(0, Math.min(...codenChartData.codenData) - 0.1)).toFixed(1))
		},
		grid: {
			left: 30,
			right: 30,
			bottom: 20,
			top: 30
		},
		series: [{
			name: 'CO',
			type: 'line',
			smooth: true,
			data: codenChartData.codenData,
			lineStyle: {
				color: '#2fd093'
			},
			areaStyle: {
				color: 'rgba(47, 208, 147, 0.2)'
			},
			itemStyle: {
				color: '#2fd093'
			}
		}]
	};

	codenEChart.setOption(option);
	codenEChart.resize();
}


const drawCo2denChart = (co2denChartData) => {
	const container = document.getElementById('mini-co2-chart');
	if (!container) return;

	if (!co2denEChart) {
		co2denEChart = echarts.init(container);
	}

	const option = {
		tooltip: {
			trigger: 'axis'
		},
		title: {
			text: `${co2denChartData.co2denData.at(-1)} ppm`,
			right: 10,
			top: 0,
			textStyle: {
				fontSize: 14,
				color: '#333'
			}
		},
		xAxis: {
			type: 'category',
			data: co2denChartData.timeHms,
			boundaryGap: false,
			axisLine: { onZero: false }
		},
		yAxis: {
			type: 'value',
			name: 'ppm',
			min: Math.max(0, Math.min(...co2denChartData.co2denData) - 3)
		},
		grid: {
			left: 30,
			right: 30,
			bottom: 20,
			top: 30
		},
		series: [{
			name: 'CO2',
			type: 'line',
			smooth: true,
			data: co2denChartData.co2denData,
			lineStyle: {
				color: '#4fbbc8'
			},
			areaStyle: {
				color: 'rgba(79, 187, 200, 0.2)'
			},
			itemStyle: {
				color: '#4fbbc8'
			}
		}]
	};

	co2denEChart.setOption(option);
	co2denEChart.resize();
}


window.addEventListener('resize', () => {
	if (dustEChart) dustEChart.resize();
	if (pm1EChart) pm1EChart.resize();
	if (pm25EChart) pm25EChart.resize();
	if (pm10EChart) pm10EChart.resize();
	if (codenEChart) codenEChart.resize();
	if (co2denEChart) co2denEChart.resize();
});