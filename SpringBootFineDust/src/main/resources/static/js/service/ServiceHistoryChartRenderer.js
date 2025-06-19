// drawAmPmAvgChart 함수 내에서 echarts 인스턴스를 전역변수로 관리하도록 수정
let amPmChart = null;

//이산화탄소 평균 차트 추가 만들거야

function drawAmPmAvgChart({ xLabels, avgPm1, avgPm25, avgPm10 }) {
  console.log(xLabels, avgPm1, avgPm25, avgPm10);

  const chartDom = document.getElementById('PastDustChart');
  if (!chartDom) {
    console.error('PastDustChart element not found');
    return;
  }

  if (!amPmChart) {
    amPmChart = echarts.init(chartDom);
  }

  const option = {
    title: { text: '시간대별 평균 미세먼지', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: {
      top: '8%',
      data: ['PM10', 'PM2.5', 'PM1.0']
    },
    xAxis: {
      type: 'category',
      data: xLabels,
      name: '시간',
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '㎍/㎥'
    },
    series: [
      {
        name: 'PM10',
        type: 'line',
        data: avgPm10,
        itemStyle: { color: '#DE2AA6' },
        smooth: true
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
  amPmChart.resize();
}

// 리사이즈 이벤트에 amPmChart 인스턴스 resize 호출로 수정
window.addEventListener('resize', () => {
  if (amPmChart) amPmChart.resize();
});


let amPmCodenChart = null;

function drawAmPmCodenChart({
  xLabels,
  amAvgCo2den, pmAvgCo2den
}) {
  const chartDom = document.getElementById('PastCodenChart');
  if (!chartDom) {
    console.error('PastCodenChart element not found');
    return;
  }
  if (!amPmCodenChart) amPmCodenChart = echarts.init(chartDom);

  const option = {
    title: { text: 'AM/PM 평균 이산화탄소', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: {
      top: '8%',
      data: [ 'CO₂ (ppm)']
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
	
  amPmCodenChart.setOption(option);
  amPmCodenChart.resize();
}

