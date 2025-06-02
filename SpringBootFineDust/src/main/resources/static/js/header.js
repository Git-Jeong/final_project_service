function toggleNotificationDropdown() {
  const dropdown = document.getElementById("notificationDropdown");
  dropdown.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const headerHTML = `
    <div class="serviceChart-header">
      <div class="serviceChart-header-left">
        <h2>실내공기질 측정시스템</h2>
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
