let amPmCodenChart = null;

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
