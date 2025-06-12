/**
 * 
 */

function drawAmPmAvgChart({
  xLabels,
  amAvgPm1, amAvgPm25, amAvgPm10,
  pmAvgPm1, pmAvgPm25, pmAvgPm10
}) {
  const chartDom = document.getElementById('PastDustChart');
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
      { name: 'PM1 (AM)', type: 'bar', data: [amAvgPm1, null], itemStyle: { color: '#FF6B6B' }},
      { name: 'PM2.5 (AM)', type: 'bar', data: [amAvgPm25, null], itemStyle: { color: '#4ECDC4' }},
      { name: 'PM10 (AM)', type: 'bar', data: [amAvgPm10, null], itemStyle: { color: '#1A535C' }},
      { name: 'PM1 (PM)', type: 'bar', data: [null, pmAvgPm1], itemStyle: { color: '#FFB400' }},
      { name: 'PM2.5 (PM)', type: 'bar', data: [null, pmAvgPm25], itemStyle: { color: '#00A8E8' }},
      { name: 'PM10 (PM)', type: 'bar', data: [null, pmAvgPm10], itemStyle: { color: '#4D4D4D' }}
    ]
  };

  chart.setOption(option);
  chart.resize();
}
