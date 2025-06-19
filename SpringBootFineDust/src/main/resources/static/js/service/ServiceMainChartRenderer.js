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

		// 색상 및 상태 문구 설정
		const qualityBox = document.querySelector(`.serviceChart-quality[data-type="${type}"]`);
		if (!qualityBox) return;

		let colorClass = '';
		let statusText = '';

		// 한국 기준 색상 및 상태 (pm1, pm2.5, pm10 각각 분리)
		if (type === 'pm1.0') {
			if (value > 50) {
				colorClass = 'red';
				statusText = '매우 나쁨 ('+value +')';
			} else if (value > 35) {
				colorClass = 'orange';
				statusText = '나쁨 ('+value +')';
			} else if (value > 15) {
				colorClass = 'green';
				statusText = '보통 ('+value +')';
			} else {
				colorClass = 'blue';
				statusText = '좋음 ('+value +')';
			}
		} else if (type === 'pm2.5') {
			if (value > 75) {
				colorClass = 'red';
				statusText = '매우나쁨 ('+value +')';
			} else if (value > 35) {
				colorClass = 'orange';
				statusText = '나쁨 ('+value +')';
			} else if (value > 15) {
				colorClass = 'green';
				statusText = '보통 ('+value +')';
			} else {
				colorClass = 'blue';
				statusText = '좋음 ('+value +')';
			}
		} else if (type === 'pm10') {
			if (value > 150) {
				colorClass = 'red';
				statusText = '매우 나쁨 ('+value +')';
			} else if (value > 80) {
				colorClass = 'orange';
				statusText = '나쁨 ('+value +')';
			} else if (value > 30) {
				colorClass = 'green';
				statusText = '보통 ('+value +')';
			} else {
				colorClass = 'blue';
				statusText = '좋음 ('+value +')';
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

	// 기준 시간 설정
	const today = new Date().toISOString().split('T')[0];
	const seriesMinTime = labels.length ? new Date(`${today}T${labels[labels.length - 1]}`) : null;
	const xMinTime = new Date(seriesMinTime?.getTime() - 30 * 1000);

	// 시작 값 추출
	const pm10Start = pm10Data[0] ?? null;
	const pm25Start = pm25Data[0] ?? null;
	const pm1Start = pm1Data[0] ?? null;
	
	// 채우기 함수
	const fillSeriesStart = (timeStr, value) => {
	  if (!timeStr || value == null) return [];
	  const filledTime = `${today}T${xMinTime.toTimeString().slice(0, 8)}`;
	  return [[filledTime, value]];
	};
	
	// 시리즈 보정
	const toTimeValue = (t, v) => [`${today}T${t}`, v];
	
	const filledPm10 = [...fillSeriesStart(labels[0], pm10Start), ...labels.map((t, i) => toTimeValue(t, pm10Data[i]))];
	const filledPm25 = [...fillSeriesStart(labels[0], pm25Start), ...labels.map((t, i) => toTimeValue(t, pm25Data[i]))];
	const filledPm1 = [...fillSeriesStart(labels[0], pm1Start), ...labels.map((t, i) => toTimeValue(t, pm1Data[i]))];

	const option = {
		title: [
			{
				text: '미세먼지 추이',
				left: 'center'
			}
		],
		tooltip: { trigger: 'axis' },
		xAxis: {
		  type: 'time',
		  name: '시간',
		  min: xMinTime, // 명시적 시작 시간
		  axisLabel: {
				formatter: value => {
					const date = new Date(value);
					const sec = date.getSeconds();
					return sec % 10 === 0 ? date.toTimeString().slice(0, 8) : '';
				}
			}
		},
		yAxis: {
			type: 'value',
			name: '㎍/㎥',
			min: Math.max(0, Math.min(...pm1Data, ...pm25Data, ...pm10Data) - 10)
		},
		legend: {
			data: ['PM10', 'PM2.5', 'PM1.0'],
			top: 0,
			left: 20
		},
		grid: {
			left: 50,
			right: 50,
			top: 70,
			bottom: 30
		},
		series: [
			{ name: 'PM10', type: 'line', smooth: true, data: filledPm10, itemStyle: { color: '#DE2AA6' } },
			{ name: 'PM2.5', type: 'line', smooth: true, data: filledPm25, itemStyle: { color: '#4169E1' } },
			{ name: 'PM1.0', type: 'line', smooth: true, data: filledPm1, itemStyle: { color: '#8E44AD' } }
		],
		graphic: {
			elements: [
				{
					type: 'text',
					right: 20,
					top: 4,
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

const drawDustPm1EChart = (snsr, pred) => {
	const container = document.getElementById('mini-pm1-chart');
	if (!container) return;

	if (!pm1EChart) {
		pm1EChart = echarts.init(container);
	}

	const today = new Date().toISOString().split('T')[0];

	const snsrSeriesRaw = snsr.timeHms.map((t, i) => ({
		value: [`${today}T${t}`, snsr.pm1Data[i]]
	}));
	const predSeriesRaw = pred.timeHms.map((t, i) => ({
		value: [`${today}T${t}`, pred.pm1Data[i]]
	}));

	// 각 시리즈 최소 시간
	const snsrMinTime = snsrSeriesRaw.length ? new Date(snsrSeriesRaw[0].value[0]) : null;
	const predMinTime = predSeriesRaw.length ? new Date(predSeriesRaw[0].value[0]) : null;

	// 전체 x축 최소값: 두 최소값 중 빠른 시간
	const minTimeCandidates = [snsrMinTime, predMinTime].filter(t => t !== null);
	const xMinTime = new Date(Math.min(...minTimeCandidates));

	// y축 시작값: 각각 첫 값
	const snsrYStart = snsr.pm1Data.length ? snsr.pm1Data[0] : null;
	const predYStart = pred.pm1Data.length ? pred.pm1Data[0] : null;

	// 시리즈별 빈 공간 채우기 함수
	const fillSeriesStart = (series, seriesMinTime, yStart) => {
		const filled = [];
		if (!seriesMinTime || !yStart) return series;
		if (seriesMinTime > xMinTime) {
			// xMinTime 시점에 yStart 값 추가
			filled.push({ value: [xMinTime.toISOString(), yStart] });
		}
		return filled.concat(series);
	};

	const snsrSeries = fillSeriesStart(snsrSeriesRaw, snsrMinTime, snsrYStart);
	const predSeries = fillSeriesStart(predSeriesRaw, predMinTime, predYStart);

	const option = {
		tooltip: { trigger: 'axis' },
		title: {
			text: `${snsr.pm1Data.at(-1)} ㎍/㎥`,
			right: 10,
			top: 0,
			textStyle: {
				fontSize: 14,
				color: '#333'
			}
		},
	    legend: {
	        left: 'center',
	        top: 'top'
	    },
		xAxis: {
			type: 'time',
			min: xMinTime,
			axisLabel: {
				formatter: value => {
					const date = new Date(value);
					const sec = date.getSeconds();
					return sec % 10 === 0 ? date.toTimeString().slice(0, 8) : '';
				}
			}
		},
		yAxis: {
			type: 'value',
			name: '㎍/㎥',
			min: Math.min(50, Math.min(...snsr.pm1Data, ...pred.pm1Data) - 10)
		},
		grid: {
			left: 30,
			right: 30,
			bottom: 20,
			top: 30
		},
		series: [
			{
				name: 'PM1.0 측정',
				type: 'line',
				data: snsrSeries,
				smooth: true,
				showSymbol: true,
				itemStyle: { color: '#8E44AD' }
			},
			{
				name: 'PM1.0 예측',
				type: 'line',
				data: predSeries,
				smooth: true,
				showSymbol: true,
				itemStyle: { color: '#3498db' },
				lineStyle: { type: 'dashed' }
			}
		]
	};

	pm1EChart.setOption(option);
	pm1EChart.resize();
};

const drawDustPm25EChart = (snsr, pred) => {
	const container = document.getElementById('mini-pm25-chart');
	if (!container) return;

	if (!pm25EChart) {
		pm25EChart = echarts.init(container);
	}

	const today = new Date().toISOString().split('T')[0];

	const snsrSeriesRaw = snsr.timeHms.map((t, i) => ({
		value: [`${today}T${t}`, snsr.pm25Data[i]]
	}));
	const predSeriesRaw = pred.timeHms.map((t, i) => ({
		value: [`${today}T${t}`, pred.pm25Data[i]]
	}));

	// 각 시리즈 최소 시간
	const snsrMinTime = snsrSeriesRaw.length ? new Date(snsrSeriesRaw[0].value[0]) : null;
	const predMinTime = predSeriesRaw.length ? new Date(predSeriesRaw[0].value[0]) : null;

	// 전체 x축 최소값: 두 최소값 중 빠른 시간
	const minTimeCandidates = [snsrMinTime, predMinTime].filter(t => t !== null);
	const xMinTime = new Date(Math.min(...minTimeCandidates));

	// y축 시작값: 각각 첫 값
	const snsrYStart = snsr.pm25Data.length ? snsr.pm25Data[0] : null;
	const predYStart = pred.pm25Data.length ? pred.pm25Data[0] : null;

	// 시리즈별 빈 공간 채우기 함수
	const fillSeriesStart = (series, seriesMinTime, yStart) => {
		const filled = [];
		if (!seriesMinTime || !yStart) return series;
		if (seriesMinTime > xMinTime) {
			// xMinTime 시점에 yStart 값 추가
			filled.push({ value: [xMinTime.toISOString(), yStart] });
		}
		return filled.concat(series);
	};

	const snsrSeries = fillSeriesStart(snsrSeriesRaw, snsrMinTime, snsrYStart);
	const predSeries = fillSeriesStart(predSeriesRaw, predMinTime, predYStart);

	const option = {
		tooltip: { trigger: 'axis' },
		title: {
			text: `${snsr.pm25Data.at(-1)} ㎍/㎥`,
			right: 10,
			top: 0,
			textStyle: {
				fontSize: 14,
				color: '#333'
			}
		},
	    legend: {
	        left: 'center',
	        top: 'top'
	    },
		xAxis: {
			type: 'time',
			min: xMinTime,
			axisLabel: {
				formatter: value => {
					const date = new Date(value);
					const sec = date.getSeconds();
					return sec % 10 === 0 ? date.toTimeString().slice(0, 8) : '';
				}
			}
		},
		yAxis: {
			type: 'value',
			name: '㎍/㎥', 
			min: Math.min(50, Math.min(...snsr.pm25Data, ...pred.pm25Data) - 10)
		},
		grid: {
			left: 30,
			right: 30,
			bottom: 20,
			top: 30
		},
		series: [
			{
				name: 'PM2.5 측정',
				type: 'line',
				data: snsrSeries,
				smooth: true,
				showSymbol: true,
				itemStyle: { color: '#4169E1' }
			},
			{
				name: 'PM2.5 예측',
				type: 'line',
				data: predSeries,
				smooth: true,
				showSymbol: true,
				itemStyle: { color: '#3498db' },
				lineStyle: { type: 'dashed' }
			}
		]
	};

	pm25EChart.setOption(option);
	pm25EChart.resize();
};

const drawDustPm10EChart = (snsr, pred) => {
	const container = document.getElementById('mini-pm10-chart');
	if (!container) return;

	if (!pm10EChart) {
		pm10EChart = echarts.init(container);
	}

	const today = new Date().toISOString().split('T')[0];

	const snsrSeriesRaw = snsr.timeHms.map((t, i) => ({
		value: [`${today}T${t}`, snsr.pm10Data[i]]
	}));
	const predSeriesRaw = pred.timeHms.map((t, i) => ({
		value: [`${today}T${t}`, pred.pm10Data[i]]
	}));

	// 각 시리즈 최소 시간
	const snsrMinTime = snsrSeriesRaw.length ? new Date(snsrSeriesRaw[0].value[0]) : null;
	const predMinTime = predSeriesRaw.length ? new Date(predSeriesRaw[0].value[0]) : null;

	// 전체 x축 최소값: 두 최소값 중 빠른 시간
	const minTimeCandidates = [snsrMinTime, predMinTime].filter(t => t !== null);
	const xMinTime = new Date(Math.min(...minTimeCandidates));

	// y축 시작값: 각각 첫 값
	const snsrYStart = snsr.pm10Data.length ? snsr.pm10Data[0] : null;
	const predYStart = pred.pm10Data.length ? pred.pm10Data[0] : null;

	// 시리즈별 빈 공간 채우기 함수
	const fillSeriesStart = (series, seriesMinTime, yStart) => {
		const filled = [];
		if (!seriesMinTime || !yStart) return series;
		if (seriesMinTime > xMinTime) {
			// xMinTime 시점에 yStart 값 추가
			filled.push({ value: [xMinTime.toISOString(), yStart] });
		}
		return filled.concat(series);
	};

	const snsrSeries = fillSeriesStart(snsrSeriesRaw, snsrMinTime, snsrYStart);
	const predSeries = fillSeriesStart(predSeriesRaw, predMinTime, predYStart);

	const option = {
		tooltip: { trigger: 'axis' },
		title: {
			text: `${snsr.pm10Data.at(-1)} ㎍/㎥`,
			right: 10,
			top: 0,
			textStyle: {
				fontSize: 14,
				color: '#333'
			}
		},
	    legend: {
	        left: 'center',
	        top: 'top'
	    },
		xAxis: {
			type: 'time',
			min: xMinTime,
			axisLabel: {
				formatter: value => {
					const date = new Date(value);
					const sec = date.getSeconds();
					return sec % 10 === 0 ? date.toTimeString().slice(0, 8) : '';
				}
			}
		},
		yAxis: {
			type: 'value',
			name: '㎍/㎥',
			min: Math.min(50, Math.min(...snsr.pm10Data, ...pred.pm10Data) - 10)
		},
		grid: {
			left: 30,
			right: 30,
			bottom: 20,
			top: 30
		},
		series: [
			{
				name: 'PM10 측정',
				type: 'line',
				data: snsrSeries,
				smooth: true,
				showSymbol: true,
				itemStyle: { color: '#DE2AA6' }
			},
			{
				name: 'PM10 예측',
				type: 'line',
				data: predSeries,
				smooth: true,
				showSymbol: true,
				itemStyle: { color: '#3498db' },
				lineStyle: { type: 'dashed' }
			}
		]
	};

	pm10EChart.setOption(option);
	pm10EChart.resize();
};

const drawCodenChart = ({ timeHms, codenData }) => {
  const container = document.getElementById('mini-co-chart');
  if (!container) return;

  if (!codenEChart) {
    codenEChart = echarts.init(container);
  }

  const today = new Date().toISOString().split('T')[0];
  const seriesData = timeHms.map((t, i) => ({
    value: [`${today}T${t}`, codenData[i]]
  }));

  const option = {
    tooltip: { trigger: 'axis' },
    title: {
      text: `${codenData.at(-1).toFixed(2)} ppm`,
      right: 10,
      top: 0,
      textStyle: { fontSize: 14, color: '#333' }
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: value => {
          const date = new Date(value);
          const sec = date.getSeconds();
          return sec % 10 === 0 ? date.toTimeString().slice(0, 8) : '';
        }
      },
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      name: 'ppm',
      min: parseFloat((Math.max(0, Math.min(...codenData) - 0.1)).toFixed(1))
    },
    grid: { left: 40, right: 30, bottom: 20, top: 30 },
    series: [{
      name: 'CO',
      type: 'line',
      smooth: true,
      data: seriesData,
      lineStyle: { color: '#2fd093' },
      areaStyle: { color: 'rgba(47, 208, 147, 0.2)' },
      itemStyle: { color: '#2fd093' },
      showSymbol: true
    }]
  };

  codenEChart.setOption(option);
  codenEChart.resize();
};

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
			left: 40,
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