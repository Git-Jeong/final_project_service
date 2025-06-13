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
  const chart = echarts.init(chartDom);

  const option = {
    title: { text: 'AM/PM 평균 미세먼지', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: {
      top: '8%',
      data: ['PM1 (AM)', 'PM2.5 (AM)', 'PM10 (AM)', 'PM1 (PM)', 'PM2.5 (PM)', 'PM10 (PM)']
    },
    xAxis: { type: 'category', data: xLabels },
    yAxis: { type: 'value', name: '㎍/㎥' },
    series: [
      { name: 'PM1 (AM)', type: 'bar', data: amAvgPm1, itemStyle: { color: '#FF6B6B' }},
      { name: 'PM2.5 (AM)', type: 'bar', data: amAvgPm25, itemStyle: { color: '#4ECDC4' }},
      { name: 'PM10 (AM)', type: 'bar', data: amAvgPm10, itemStyle: { color: '#1A535C' }},
      { name: 'PM1 (PM)', type: 'bar', data: pmAvgPm1, itemStyle: { color: '#FFB400' }},
      { name: 'PM2.5 (PM)', type: 'bar', data: pmAvgPm25, itemStyle: { color: '#00A8E8' }},
      { name: 'PM10 (PM)', type: 'bar', data: pmAvgPm10, itemStyle: { color: '#4D4D4D' }}
    ]
  };

  chart.setOption(option);
  chart.resize();
}

/* 
// DOM이 완전히 로드되면 호출
    window.onload = function() {
      drawAmPmAvgChart({
        xLabels: ['AM', 'PM'],
        amAvgPm1: amAvgPm1, amAvgPm25: amAvgPm25, amAvgPm10: amAvgPm10,
        pmAvgPm1: pmAvgPm1, pmAvgPm25: pmAvgPm25, pmAvgPm10: pmAvgPm10
      });
};
*/