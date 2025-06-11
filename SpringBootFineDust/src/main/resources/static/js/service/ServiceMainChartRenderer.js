let dustEChart = null;
let pm1EChart = null;
let pm25EChart = null;
let pm10EChart = null;

let codenEChart = null;
let co2denEChart = null;

const updateAirQualitySignal = (data) => {
	const signals = [
		{ type: 'pm1', value: data.pm1 },
		{ type: 'pm2', value: data.pm25 },
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

		if (value >= 40) {
			colorClass = 'red';
			statusText = '나쁨';
		} else if (value >= 20) {
			colorClass = 'yellow';
			statusText = '보통';
		} else {
			colorClass = 'blue';
			statusText = '좋음';
		}

		// 기존 클래스 제거 후 새로운 색상 클래스 추가
		qualityBox.classList.remove('red', 'yellow', 'blue');
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
        },
        {
            // 시간 표시용 부제 추가
            id: 'clock', // 업데이트를 위한 id
            text: `기준시간: ${new Date().toTimeString().substring(0, 8)}`, // 초기 시간 설정
            right: 0,   // 우측 여백
            top: 0,     // 상단 여백
            textStyle: {
                fontSize: 12,
                color: '#000000'
	            }
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
			top: 0,
			left: 0
		},
		grid: {
			left: '3%',    // 좌측 여백 (기본값 보통 10~15%)
			right: '5%',   // 우측 여백
			bottom: '8%',  // 아래 여백
		},
		series: [
			{ name: 'PM1.0', type: 'line', smooth: true, data: pm1Data, itemStyle: { color: '#FF6B6B' } },
			{ name: 'PM2.5', type: 'line', smooth: true, data: pm25Data, itemStyle: { color: '#4ECDC4' } },
			{ name: 'PM10', type: 'line', smooth: true, data: pm10Data, itemStyle: { color: '#1A535C' } }
		]
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
		xAxis: {
			type: 'category',
			data: timeHms,
			boundaryGap: false,
			axisLine: { onZero: false }
		},
		yAxis: {
			type: 'value'
		},
		grid: {
			left: '8%',
			right: '8%',
			bottom: '10%',
			top: '15%'
		},
		series: [{
			name: 'PM1.0',
			type: 'line',
			data: pm1Data,
			smooth: true,
			itemStyle: { color: '#FF6B6B' }
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
		xAxis: {
			type: 'category',
			data: timeHms,
			boundaryGap: false,
			axisLine: { onZero: false }
		},
		yAxis: {
			type: 'value'
		},
		grid: {
			left: '8%',
			right: '8%',
			bottom: '10%',
			top: '15%'
		},
		series: [{
			name: 'PM25',
			type: 'line',
			data: pm25Data,
			smooth: true,
			itemStyle: { color: '#4ECDC4' }
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
		xAxis: {
			type: 'category',
			data: timeHms,
			boundaryGap: false,
			axisLine: { onZero: false }
		},
		yAxis: {
			type: 'value'
		},
		grid: {
			left: '8%',
			right: '8%',
			bottom: '10%',
			top: '15%'
		},
		series: [{
			name: 'PM10',
			type: 'line',
			data: pm10Data,
			smooth: true,
			itemStyle: { color: '#1A535C' }
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
		xAxis: {
			type: 'category',
			data: codenChartData.timeHms,
			boundaryGap: false,
			axisLine: { onZero: false }
		},
		yAxis: {
			type: 'value',
			name: 'CO',
			min: 0
			
			  
		},
		grid: {
			left: '8%',
			right: '8%',
			bottom: '10%',
			top: '15%'
		},
		series: [{
			name: 'CO',
			type: 'line',
			smooth: true,
			data: codenChartData.codenData,
			lineStyle: {
				color: '#8e44ad'
			},
			areaStyle: {
				color: 'rgba(142, 68, 173, 0.2)'
			},
			symbol: 'circle',
			symbolSize: 6
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
		xAxis: {
			type: 'category',
			data: co2denChartData.timeHms,
			boundaryGap: false,
			axisLine: { onZero: false }
		},
		yAxis: {
			type: 'value',
			name: 'CO2',
			min: 830
		},
		grid: {
			left: '8%',
			right: '8%',
			bottom: '10%',
			top: '15%'
		},
		series: [{
			name: 'CO2',
			type: 'line',
			smooth: true,
			data: co2denChartData.co2denData,
			lineStyle: {
				color: '#8e44ad'
			},
			areaStyle: {
				color: 'rgba(142, 68, 173, 0.2)'
			},
			symbol: 'circle',
			symbolSize: 6
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