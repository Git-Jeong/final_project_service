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