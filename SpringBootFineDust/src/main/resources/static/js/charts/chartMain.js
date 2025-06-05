
/*  함수 캡슐화 */
function ChartModule() {
    let lastDate = 0;
    let data = [], data2 = [],data3 = [];
    const TICKINTERVAL = 1000;
    const XAXISRANGE = 59000;

		/* 데이터 1,2,3의 초기 데이터 설정  */
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
	
	
		function getDay3WiseTimeSeries(baseval, count, yrange) {
		for (let i = 0; i < count; i++) {
			let x = baseval;
			let y = (yrange.max - yrange.min) / 2 * Math.sin((i / 30) * Math.PI + 1*Math.PI ) + (yrange.max - yrange.min) / 2 + yrange.min;
			data3.push({ x, y });
			baseval += TICKINTERVAL;
		}
	}
	
	
	/* 새로운 데이터 갱신 함수 */
	function getNewSeries(baseval, yrange) {
		let newDate = baseval + TICKINTERVAL;
		lastDate = newDate;
		let Date_ = new Date('06 Dec 2019 GMT').getTime();
	

	/* 새로운 데이터 주입 함수 */
		data.push({
			x: newDate,
			y: (yrange.max - yrange.min) / 2 * Math.cos(((Date_ - newDate) / 30000) * Math.PI) + (yrange.max - yrange.min) / 2 + yrange.min
		});
		data2.push({
			x: newDate,
			y: (yrange.max - yrange.min) / 2 * Math.sin(((Date_ - newDate + 30000) / 30000) * Math.PI) + (yrange.max - yrange.min) / 2 + yrange.min
		});
		
		data3.push({
			x: newDate,
			y: (yrange.max - yrange.min) / 2 * Math.sin(((Date_ - newDate + 30000) / 30000) * Math.PI + 1*Math.PI) + (yrange.max - yrange.min) / 2 + yrange.min
		});
		
	}
	
	function resetData() {
		data = data.slice(data.length - 60);
		data2 = data2.slice(data2.length - 60);
		data3 = data3.slice(data3.length - 60);
	}
	
	getDayWiseTimeSeries(new Date('06 Dec 2019 GMT').getTime(), 60, { min: 10, max: 90 });
	getDay2WiseTimeSeries(new Date('06 Dec 2019 GMT').getTime(), 60, { min: 10, max: 90 });
	getDay3WiseTimeSeries(new Date('06 Dec 2019 GMT').getTime(), 60, { min: 10, max: 90 });
	
	new Vue({
		el: '#app',
		components: { apexchart: VueApexCharts },
		data: {
			series: [
				{ name: 'Cosine1', data: data.slice() },
				{ name: 'Sine', data: data2.slice() } ,
				{ name: 'Sine', data: data3.slice() }
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
					range: XAXISRANGE,
					tickAmount: 1
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
				getNewSeries(lastDate, { min: 10, max: 90 });
				me.$refs.chart.updateSeries([
					{ name: 'Cosine1', data: data },
					{ name: 'Sine', data: data2 },
					{ name: 'Sine', data: data3 }
				]);
			}, 1000);
	
			setInterval(() => {
				resetData();
				me.$refs.chart.updateSeries([
					{ name: 'Cosine1', data: data },
					{ name: 'Sine', data: data2 },
					{ name: 'Sine', data: data3 }
				], false, true);
			}, 60000);
		/*값은 new=1000 : 1초마다 새 데이터 reset = 60000 고정*/	
			
		}
	});
} 
ChartModule();
