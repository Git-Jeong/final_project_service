

var lastDate = 0;
var data = [], data2 = [];
var TICKINTERVAL = 100220;
let XAXISRANGE = 59000;

function getDayWiseTimeSeries(baseval, count, yrange) {
	for (let i = 0; i < count; i++) {
		let x = baseval;
		let y = (yrange.max - yrange.min) / 2 * Math.cos((i / 30) * Math.PI) + (yrange.max - yrange.min) / 2 + yrange.min;
		data.push({ x, y });
		lastDate = baseval;
		baseval += TICKINTERVAL;
	}
}

function getDay2WiseTimeSeries(baseval, count, yrange) {
	for (let i = 0; i < count; i++) {
		let x = baseval;
		let y = (yrange.max - yrange.min) / 2 * Math.sin((i / 30) * Math.PI) + (yrange.max - yrange.min) / 2 + yrange.min;
		data2.push({ x, y });
		baseval += TICKINTERVAL;
	}
}

function getNewSeries(baseval, yrange) {
	let newDate = baseval + TICKINTERVAL;
	lastDate = newDate;
	let Date_ = new Date('06 Dec 2019 GMT').getTime();

	for (let i = 0; i < data.length - 60; i++) {
		data[i].x = newDate - XAXISRANGE - TICKINTERVAL;
		data[i].y = 0;
		data2[i].x = newDate - XAXISRANGE - TICKINTERVAL;
		data2[i].y = 0;
	}

	data.push({
		x: newDate,
		y: (yrange.max - yrange.min) / 2 * Math.cos(((Date_ - newDate) / 30000) * Math.PI) + (yrange.max - yrange.min) / 2 + yrange.min
	});
	data2.push({
		x: newDate,
		y: (yrange.max - yrange.min) / 2 * Math.sin(((Date_ - newDate + 30000) / 30000) * Math.PI) + (yrange.max - yrange.min) / 2 + yrange.min
	});
}

function resetData() {
	data = data.slice(data.length - 60);
	data2 = data2.slice(data2.length - 60);
}

getDayWiseTimeSeries(new Date('06 Dec 2019 GMT').getTime(), 60, { min: 10, max: 90 });
getDay2WiseTimeSeries(new Date('06 Dec 2019 GMT').getTime(), 60, { min: 10, max: 90 });

new Vue({
	el: '#app',
	components: { apexchart: VueApexCharts },
	data: {
		series: [
			{ name: 'Cosine1', data: data.slice() },
			{ name: 'Sine', data: data2.slice() }
		],
		chartOptions: {
			chart: {
				id: 'realtime',
				minHeight: "100px",
				type: 'line',
				animations: {
					enabled: true,
					easing: 'linear',
					dynamicAnimation: { speed: 1000 }
				},
				toolbar: { show: true },
				zoom: { enabled: false }
			},
			dataLabels: { enabled: true },
			title: {
				text: 'Dynamic Updating Chart',
				align: 'left'
			},
			markers: { size: 0 },
			xaxis: {
				type: 'datetime',
				range: XAXISRANGE,
				tickAmount: 1
			},
			stroke: {
			    curve: 'smooth',
			    width: 3,
  				lineCap: 'round'
			  },
			yaxis: {
				max: 110,
				labels: {
					formatter: function(val) {
						return Math.round(val); // 소수점 제거
					}
				}
			}
			,
			legend: { show: true }
		}
	},
	mounted: function() {
		const me = this;
		setInterval(() => {
			getNewSeries(lastDate, { min: 10, max: 90 });
			me.$refs.chart.updateSeries([
				{ name: 'Cosine1', data: data },
				{ name: 'Sine', data: data2 }
			]);
		}, 1000);

		setInterval(() => {
			resetData();
			me.$refs.chart.updateSeries([
				{ name: 'Cosine1', data: data },
				{ name: 'Sine', data: data2 }
			], false, true);
		}, 60000);
	}
});
