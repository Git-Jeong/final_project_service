const dustStack = [];
const predStack = [];
const stackSize = 60;

// 역 바꾸게 되면 스택 초기화
const resetDustStack = () => {
	dustStack.length = 0;
}

const startPredDust = (stId) => {
	$.ajax({
		url: "savePred",
		type: "post",
		data: JSON.stringify(stId),
		contentType: "application/json",
		error: function(err) {
			console.error("데이터 불러오기 실패:", err);
		}
	});
}

// 데이터 불러오는 함수
const getStationDust = (stId) => {
	$.ajax({
		url: "getStationDustOne",
		type: "get",
		data: { "stId": stId },
		success: function(data) {
			const dtoDust = data.snsr;
			const dtoPred = data.pred;

			const dto_temp = Math.round(dtoDust.temp * 10) / 10;
			const dto_humidity = Math.round(dtoDust.humidity * 10) / 10;
			const today = new Date().toISOString().split('T')[0];

			document.getElementById("temp").textContent = "온도: 🌡️ " + dto_temp + "℃";
			document.getElementById("humidity").textContent = "습도: 💧 " + dto_humidity + "%";
			document.getElementById("dtime").textContent = "갱신: 📅 " + today + " ⏰" + dtoDust.timeHms;

			const lastDust = dustStack[dustStack.length - 1];
			const lastPred = predStack[predStack.length - 1];

			// 직전 dust 데이터와 비교
			if (!lastDust || JSON.stringify(lastDust) !== JSON.stringify(dtoDust)) {
				dustStack.push(dtoDust);
			}

			// 직전 pred 데이터와 비교
			if (!lastPred || JSON.stringify(lastPred) !== JSON.stringify(dtoPred)) {
				predStack.push(dtoPred);
				//console.log("예측데이터 불러온 결과 = " + JSON.stringify(dtoPred));
			}

			if (dustStack.length > stackSize) {
				dustStack.shift();
			}

			while (predStack.length > 0 && dustStack.length > 0) {
				const predTimeStr = predStack[0]?.timeHms;
				const dustTimeStr = dustStack[0]?.timeHms;

				// 문자열 "HH:mm:ss" -> Date 객체 변환 (기준일 동일)
				const predTime = new Date("1970-01-01T" + predTimeStr + "Z");
				const dustTime = new Date("1970-01-01T" + dustTimeStr + "Z");

				if (predTime < dustTime) {
					predStack.shift();
				} else {
					break;
				}
			}


			if (dustStack.length > 0) {
				const latestDustTime = dustStack[dustStack.length - 1]?.timeHms;

				while (dustStack.length > 0) {
					const dustTime = dustStack[0]?.timeHms;

					const dustDateLatest = new Date("1970-01-01T" + latestDustTime + "Z");
					const dustDateOld = new Date("1970-01-01T" + dustTime + "Z");

					const diffSec = (dustDateLatest - dustDateOld) / 1000;

					if (diffSec > 30) {
						dustStack.shift();
					} else {
						//console.log("dustStack size = " + dustStack.length);
						break;
					}
				}
			}

			updateAirQualitySignal(dtoDust);

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

			
		},
		error: function(err) {
			console.error("데이터 불러오기 실패:", err);
		}
	});
}

const updateAirQualitySignal = (dtoDust) => {
	console.log(dtoDust);
}

document.addEventListener('DOMContentLoaded', () => {
	setInterval(() => {
		const selectedValue = document.getElementById('stationSelect').value;
		getStationDust(selectedValue);
	}, 5000);

	setInterval(() => {
		const selectedValue = document.getElementById('stationSelect').value;
		startPredDust(selectedValue);
	}, 5000);

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

