
let dustStack = [];
const stackSize = 1;

const getStationOneDust = (stId) => {
	$.ajax({
		url: "getStationDustOne",
		type: "get",
		data: { stId },
		success: function(data) {
			const dto = Array.isArray(data) ? data[0] : data;
			dustStack.push(dto);
			if (dustStack.length > stackSize) dustStack.shift();
		},
		error: function(err) {
			console.error("데이터 불러오기 실패:", err);
		}
	});
};

// notiType에 따른 아이콘 클래스 매핑
const iconMap = {
	error: "bi-exclamation-triangle-fill",
	warning: "bi-exclamation-circle-fill",
	info: "bi-info-circle-fill"
};


// 시간차 계산 함수 (현재 시간 - notiTime)
function timeAgo(notiTime) {
	const now = new Date();
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


// 외부 접근용 함수로 전역에 할당
window.renderNotifications = function(notifications) {
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
};

document.addEventListener('DOMContentLoaded', () => {
	setInterval(() => {
		const selectedValue = document.getElementById('stationSelect').value;
		getStationOneDust(selectedValue);
	}, 1000);
});

/*
let getWeekday = "2025-05-05";
const weekday = new Date(getWeekday).toLocaleDateString('en-US', { weekday: 'long' });
 */

const barChartSho = (weekday) => {
console.log("barChartSho = " + weekday); // 예: Monday
	$.ajax({
		url: `/weekday/${weekday}`,
		type: "GET",
		success: function(data) {
			if (!data || !data.xLabels) {
				console.warn("데이터 없음");
				return;
			}
			// 차트 렌더링
			console.log(data);
			drawAmPmAvgChart(data);
			
		},
		error: function(err) {
			console.error("데이터 요청 실패", err);

		}
	});
};

