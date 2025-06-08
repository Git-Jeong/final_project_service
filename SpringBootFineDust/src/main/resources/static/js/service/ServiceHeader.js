const pageTitle = window.model?.headerText || '서비스 페이지';

function toggleNotificationDropdown() {
	const dropdown = document.getElementById("notificationDropdown");
	dropdown.classList.toggle("hidden");
}

function notificationDropdown_close() {
	const dropdown = document.getElementById("notificationDropdown");
	dropdown.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
	const headerHTML = `
    <div class="serviceChart-header">
      <div class="serviceChart-header-left">
        <h2>${pageTitle}</h2>
      </div>
      <div class="serviceChart-header-right">
        <button class="mypage-button" onclick="location.href='update'">
          <span>마이페이지</span>
          <i class="bi-person-circle mypage-icon"></i>
        </button>
        <button class="notification-button" onclick="toggleNotificationDropdown()">
          <span>알림</span>
          <i class="bi-bell notification-icon"></i>
        </button>
        <button class="logout-button" onclick="goLogout()">
          <span>로그아웃</span>
          <i class="bi-box-arrow-right logout-icon"></i>
        </button>
      </div>
    </div>
  `;

	const headerContainer = document.getElementById("serviceChart-header");
	if (headerContainer) {
		headerContainer.innerHTML = headerHTML;
	}
});

document.addEventListener('DOMContentLoaded', () => {
	const input = document.querySelector('.serviceChart-date');

	function updateKoreanDatetimeLocal() {
		const now = new Date();
		const krDate = new Date(now.getTime());

		const year = krDate.getFullYear();
		const month = String(krDate.getMonth() + 1).padStart(2, '0');
		const day = String(krDate.getDate()).padStart(2, '0');
		const hour = String(krDate.getHours()).padStart(2, '0');
		const minute = String(krDate.getMinutes()).padStart(2, '0');

		const formatted = `${year}-${month}-${day}T${hour}:${minute}`;

		input.value = formatted;
		input.max = formatted;
	}

	updateKoreanDatetimeLocal();

	setInterval(() => {
		const now = new Date();
		if (now.getSeconds() === 0) {
			updateKoreanDatetimeLocal();
		}
	}, 1000);
});

const goLogout = () => {
	if (confirm("로그아웃을 하시겠습니까?")) {
		fetch("/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then(res => res.text())
		.then(response => {
			if (response === "success") {
				location.href = "/";
			}
		})
		.catch(error => {
			alert("서버 오류: " + error);
		});
	}
}

$(document).ready(function() {
  $.ajax({
    url: "/getAllNotify",
    method: "GET",
    success: function(data) {
      // data가 알림 리스트라고 가정
      renderNotifications(data);
    },
    error: function(error) {
      console.error("알림 조회 실패:", error);
    }
  });
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
        <h3>오류 알림</h3>
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
          </div>
          <div class="notification-title-time">${timeText}</div>
        </div>
        <ul class="notification-content-box">
          <li class="notification-time">시간: ${noti.notiTime.replace("T", " ")}</li>
          <li class="notification-content">내용: ${noti.notiContent_1}</li>
          <li class="notification-state">상태: ${noti.notiContent_2}</li>
        </ul>
      </div>
    `;

    container.append(card);
  });
}
