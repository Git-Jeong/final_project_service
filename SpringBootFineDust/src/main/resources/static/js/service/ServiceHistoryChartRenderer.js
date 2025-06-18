// drawAmPmAvgChart 함수 내에서 echarts 인스턴스를 전역변수로 관리하도록 수정
let amPmChart = null;

//이산화탄소 평균 차트 추가 만들거야
let amPmCodenChart = null

function drawAmPmAvgChart({
  xLabels,
  amAvgPm1, amAvgPm25, amAvgPm10,
  pmAvgPm1, pmAvgPm25, pmAvgPm10
}) {
  const chartDom = document.getElementById('PastDustChart');
  if (!chartDom) {
    console.error('PastDustChart element not found');  
    return;
  }
  if (!amPmChart) amPmChart = echarts.init(chartDom);

  const option = {
    title: { text: 'AM/PM 평균 미세먼지', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: {
      top: '8%',
      data: ['PM1.0', 'PM2.5', 'PM10']
    },
    xAxis: { type: 'category', data: xLabels },
    yAxis: { type: 'value', name: '㎍/㎥' },
    series: [
     
      { name: 'PM1.0', type: 'bar', data: [amAvgPm1, pmAvgPm1], itemStyle: { color: '#4D4D4D' }},
 	{ name: 'PM2.5', type: 'bar', data: [amAvgPm25,pmAvgPm25], itemStyle: { color: '#1A535C' }},
      { name: 'PM10', type: 'bar', data: [amAvgPm10, pmAvgPm10], itemStyle: { color: '#FFB400' }},

    ]
  };//색이 참 마음에 안드네

  amPmChart.setOption(option);
  amPmChart.resize();
}

// 리사이즈 이벤트에 amPmChart 인스턴스 resize 호출로 수정
window.addEventListener('resize', () => {
  if (amPmChart) amPmChart.resize();
});

function drawAmPmCodenChart({
  amAvgCoden, pmAvgCoden,
  amAvgCo2den, pmAvgCo2den
}) {
  const chartDom = document.getElementById('PastCodenChart');
  if (!chartDom) {
    console.error('PastCodenChart element not found');
    return;
  }
  if (!amPmCodenChart) amPmCodenChart = echarts.init(chartDom);

  const option = {
    title: { text: 'AM/PM 평균 가스 농도 (꺾은선)', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: {
      top: '8%',
      data: ['CO (ppm)', 'CO₂ (ppm)']
    },
    xAxis: {
      type: 'category',
      data: ['AM', 'PM']
    },
    yAxis: {
      type: 'value',
      name: 'ppm'
    },
    series: [
      {
        name: 'CO (ppm)',
        type: 'line',
        data: [amAvgCoden, pmAvgCoden],
        itemStyle: { color: '#2fd093' },
        symbol: 'circle',
        lineStyle: { width: 2 },
        smooth: true
      },
      {
        name: 'CO₂ (ppm)',
        type: 'line',
        data: [amAvgCo2den, pmAvgCo2den],
        itemStyle: { color: '#597ef7' },
        symbol: 'circle',
        lineStyle: { width: 2 },
        smooth: true
      }
    ]
  };

  amPmCodenChart.setOption(option);
  amPmCodenChart.resize();
}

