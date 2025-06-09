/* 
이거 복사붙여넣기 해라
*/

function ChartModule1() {
    let lastDate = 0;
    let data = [];
    const TICKINTERVAL = 100220;
    const XAXISRANGE = 59000;

    function getDayWiseTimeSeries(baseval, count, yrange) {
        for (let i = 0; i < count; i++) {
            let x = baseval;
            let y = (yrange.max - yrange.min) / 2 * Math.cos((i / 30) * Math.PI) + (yrange.max - yrange.min) / 2 + yrange.min;
            data.push({ x, y });
            lastDate = baseval;
            baseval += TICKINTERVAL;
        }
    }

	
	function getNewSeries(baseval, yrange) {
		let newDate = baseval + TICKINTERVAL;
		lastDate = newDate;
		let Date_ = new Date('06 Dec 2019 GMT').getTime();
	

	
		data.push({
			x: newDate,
			y: (yrange.max - yrange.min) / 2 * Math.cos(((Date_ - newDate) / 30000) * Math.PI) + (yrange.max - yrange.min) / 2 + yrange.min
		});

	}
	function resetData() {
		data = data.slice(data.length - 60);
		
	}
	
	getDayWiseTimeSeries(new Date('06 Dec 2019 GMT').getTime(), 60, { min: 10, max: 90 });
	
	
	new Vue({
		el: '#app2',
		components: { apexchart: VueApexCharts },
		data: {
			series: [
				{ name: 'Cosine1', data: data.slice() }
				
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
					text: 'PM1',
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
					{ name: 'Cosine1', data: data }
					
				]);
			}, 10000);
	
			setInterval(() => {
				resetData();
				me.$refs.chart.updateSeries([
					{ name: 'Cosine1', data: data }
					
				], false, true);
			}, 600000);
		}
	});
} 

ChartModule1();

