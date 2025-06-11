const dustStack = [];
const stackSize = 30;

const resetDustStack = () => {
	dustStack.length = 0;
}

// 데이터 불러오는 함수
const getStationDust = (stId) => {
	$.ajax({
		url: "getStationDustOne",
		type: "get",
		data: { "stId": stId },
		success: function(data) {
			// 스택에 데이터 추가
			const dto = Array.isArray(data) ? data[0] : data;
			const dto_temp = Math.round(dto.temp * 10) / 10;
			const dto_humidity = Math.round(dto.humidity * 10) / 10;
			const today = new Date().toISOString().split('T')[0];

			document.getElementById("temp").textContent = "온도 : " + dto_temp + "℃";
			document.getElementById("humidity").textContent = "습도 : " + dto_humidity + "%";
			document.getElementById("dtime").textContent = "갱신 : " + today + " " + dto.timeHms;
			
			// 스택에 데이터 추가
			dustStack.push(dto);

			// 크기 초과 시 가장 오래된 데이터 제거
			if (dustStack.length > stackSize) {
				dustStack.shift();
			}

			updateAirQualitySignal(dto)
			
			const dustMainChartData = {
				timeHms: [],
				pm1Data: [],
				pm25Data: [],
				pm10Data: [],
			    codenData: [],
  				co2denData: []
			};
			
			dustStack.forEach(d => {
				dustMainChartData.timeHms.push(d.timeHms);
				dustMainChartData.pm1Data.push(d.pm1);
				dustMainChartData.pm25Data.push(d.pm25);
				dustMainChartData.pm10Data.push(d.pm10);
				dustMainChartData.codenData.push(d.coden);   
  				dustMainChartData.co2denData.push(d.co2den);  
			});

			const dustPm1ChartData = {
				timeHms: dustMainChartData.timeHms,
				pm1Data: dustMainChartData.pm1Data,
			};

			const dustPm25ChartData = {
				timeHms: dustMainChartData.timeHms,
				pm25Data: dustMainChartData.pm25Data,
			};

			const dustPm10ChartData = {
				timeHms: dustMainChartData.timeHms,
				pm10Data: dustMainChartData.pm10Data,
			};
			
			const codenChartData = {
			  timeHms: dustMainChartData.timeHms,
			  codenData: dustMainChartData.codenData
			};
			
			const co2denChartData = {
			  timeHms: dustMainChartData.timeHms,
			  co2denData: dustMainChartData.co2denData
			};

			drawDustMainEChart(dustMainChartData);
			drawDustPm1EChart(dustPm1ChartData);
			drawDustPm25EChart(dustPm25ChartData);
			drawDustPm10EChart(dustPm10ChartData);
			drawCodenChart(codenChartData);
			drawCo2denChart(co2denChartData);
		},
		error: function(err) {
			console.error("데이터 불러오기 실패:", err);
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {

	setInterval(() => {
		const selectedValue = document.getElementById('stationSelect').value;
		getStationDust(selectedValue);
	}, 1000);
});

// notiType에 따른 아이콘 클래스 매핑
const iconMap = {
	error: "bi-exclamation-triangle-fill",
	warning: "bi-exclamation-circle-fill",
	info: "bi-info-circle-fill"
};

// 시간차 계산 함수 (현재 시간 - notiTime)
function timeAgo(notiTime) {
	const now = new Date(); // 현재 시간 사용
	const past = new Date(notiTime);
	const diffMs = now - past;
	const diffMinutes = Math.floor(diffMs / 1000 / 60);

	if (diffMinutes < 1) return "방금 전";
	if (diffMinutes < 60) return `${diffMinutes}분 전`;
	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) return `${diffHours}시간 전`;
	const diffDays = Math.floor(diffHours / 24);
	return `${diffDays}일 전`;
}

function renderNotifications(notifications) {
	const container = $("#notificationDropdown");
	container.empty();

	container.append(`
    <div class="notificationDropdown_header">
      <div class="notificationDropdown_close">
        <button class="notificationDropdown_close_btn" onclick="notificationDropdown_close()">
          <h4><i class="fas fa-times"></i></h4>
        </button>
      </div>
      <div class="notificationDropdown_header_txt">
        <h3>시스템 알림</h3>
      </div>
      <div class="notificationDropdown_delete">
        <button class="notificationDropdown_delete_btn" onclick="notificationDropdown_delete()">
          <h4><i class="fas fa-trash-alt"></i></h4>
        </button>
      </div>
    </div>
  `);

	notifications.forEach(noti => {
		const iconClass = iconMap[noti.notiType] || "bi-info-circle-fill";
		const timeText = timeAgo(noti.notiTime);

		const card = `
      <div class="notification-card ${noti.notiType}">
        <div class="notification-title-box">
          <div class="notification-title-left-box">
            <div class="notification-title-icon">
              <i class="${iconClass}"></i>
            </div>
            <div class="notification-title-content">${noti.notiTitle}</div>
          	<div class="notification-title-time">${timeText}</div>
          </div>
          <button class="notification-delete-one" onclick="notificationDropdown_one_delete(${noti.notiId})">
				X
		  </button>
        </div>
        <ul class="notification-content-box">
          <li class="notification-time">시간 : ${noti.notiTime.replace("T", " ")}</li>
          <li class="notification-content">내용 : ${noti.notiContent_1}</li>
          <li class="notification-state">${noti.notiContent_2}</li>
        </ul>
      </div>
    `;

		container.append(card);
	});
}

