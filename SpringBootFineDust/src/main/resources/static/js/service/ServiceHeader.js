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

function toggleNotificationDropdown() {
  const dropdown = document.getElementById("notificationDropdown");
  dropdown.classList.toggle("hidden");

  // 드롭다운 열릴 때만 읽지 않은 알림 처리
  if (!dropdown.classList.contains("hidden")) {
    // 현재 화면에 있는 알림 중 isRead == 0인 noti_id 수집
    const unreadIds = [];

    // 이전에 불러온 알림 데이터 접근 (전역 변수로 저장 필요)
    if (window.cachedNotifications) {
      window.cachedNotifications.forEach(noti => {
        if (noti.isRead === 0) {
          unreadIds.push(noti.noti_id);
        }
      });
    }

    if (unreadIds.length > 0) {
      $.ajax({
        url: "/notifyRead", // 서버에서 처리할 엔드포인트
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ notiIds: unreadIds }),
        success: function () {
          $(".notification-button").removeClass("notify-alert");
        },
        error: function (err) {
          console.error("알림 읽음 처리 실패:", err);
        }
      });
    }
  }
}


$(document).ready(function() {
  function fetchNotifications() {
    $.ajax({
      url: "/getAllNotify",
      method: "GET",
      success: function(data) {
		window.cachedNotifications = data;
        const hasUnread = data.some(noti => noti.isRead === 0);
        const $btn = $(".notification-button");
        if (hasUnread) {
          $btn.addClass("notify-alert");
        } else {
          $btn.removeClass("notify-alert");
        }
        renderNotifications(data);
      },
      error: function(error) {
        console.error("알림 조회 실패:", error);
      }
    });
  }

  fetchNotifications();
  setInterval(fetchNotifications, 32000);
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
