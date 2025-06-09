


/*  함수 캡슐화 */
function ChartModule(dat) {
	let data = [], data2 = [], data3 = [];
	const TICKINTERVAL = 1000;
	const XAXISRANGE = 9 * TICKINTERVAL;

	/* 데이터 1,2,3의 초기 데이터 설정  */
	function getDayWiseTimeSeries(count) {
		for (let i = 0; i < count; i++) {
			let x = dat[i].dtime;
			let y = dat[i].pm10;
			data.push({ x, y });
		}
	}


	function getDay2WiseTimeSeries(count) {
		for (let i = 0; i < count; i++) {
			let x = dat[i].dtime;
			let y = dat[i].pm25;
			data2.push({ x, y });
		}
	}


	function getDay3WiseTimeSeries(count) {
		for (let i = 0; i < count; i++) {
			let x = dat[i].dtime;
			let y = dat[i].pm1;
			data3.push({ x, y });
		}
	}


	/* 새로운 데이터 갱신 함수 */
	function getNewSeries() {
		let newDate = dat[0].dtime;
		console.log(dat[0].dtime);
		$("#value10").html(dat[0].pm10);
		console.log(dat[0].pm10);
		$("#value25").html(dat[0].pm25);
		$("#value1").html(dat[0].pm1);
		/* 새로운 데이터 주입 함수 */
		data.push({
			x: newDate,
			y: dat[0].pm10
		});
		data2.push({
			x: newDate,
			y: dat[0].pm25
		});

		data3.push({
			x: newDate,
			y: dat[0].pm1
		});

	}

	function resetData() {
		data = data.slice(data.length - 10);
		data2 = data2.slice(data2.length - 10);
		data3 = data3.slice(data3.length - 10);
	}

	getDayWiseTimeSeries(10);
	getDay2WiseTimeSeries(10);
	getDay3WiseTimeSeries(10);

	new Vue({
		el: '#app',
		components: { apexchart: VueApexCharts },
		data: {
			series: [
				{ name: 'PM10', data: data.slice() },
				{ name: 'PM2.5', data: data2.slice() },
				{ name: 'PM1', data: data3.slice() }
			],
			chartOptions: {
				chart: {
					id: 'realtime',
					minHeight: "100px",
					type: 'line',
					animations: {
						enabled: true,
						easing: 'linear',
						dynamicAnimation: { speed: 1200 }
					},
					toolbar: { show: true },
					zoom: { enabled: false }
				},
				dataLabels: { enabled: false },
				title: {
					text: 'Dynamic Updating Chart',
					align: 'left'
				},
				markers: { size: 0 },
				xaxis: {
					type: 'datetime',
					range: XAXISRANGE
				},
				stroke: {
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
				getNewSeries();
				console.log(this.$refs.chart);
				me.$refs.chart.updateSeries([
					{ name: 'PM10', data: data },
					{ name: 'PM2.5', data: data2 },
					{ name: 'PM1', data: data3 }
				]);
			}, 1000);

			setTimeout(() => {
				this.$refs.chart.updateSeries(this.series);
			}, 1000);

			setInterval(() => {
				resetData();
				me.$refs.chart.updateSeries([
					{ name: 'PM10', data: data },
					{ name: 'PM2.5', data: data2 },
					{ name: 'PM1', data: data3 }
				], false, true);
			}, 60000);
			/*값은 new=1000 : 1초마다 새 데이터 reset = 60000 고정*/

		}
	});
} 
