let userNameSide = null
let pageTitleSide = null;

function toggleNotificationDropdown() {
	const dropdown = document.getElementById("notificationDropdown");
	dropdown.classList.toggle("hidden");

	// 드롭다운 열릴 때만 읽지 않은 알림 처리
	if (!dropdown.classList.contains("hidden")) {
		const unreadIds = [];
		if (window.cachedNotifications) {
			window.cachedNotifications.forEach(noti => {
				if (noti.isRead === 0) {
					unreadIds.push(noti.notiId);
				}
			});
		}

		if (unreadIds.length > 0) {
			$.ajax({
				url: "/notifyRead",
				method: "POST",
				contentType: "application/json",
				data: JSON.stringify({ notiIds: unreadIds }),
				success: function() {
					$(".notification-button").removeClass("notify-alert");
				},
				error: function(err) {
					console.error("알림 읽음 처리 실패:", err);
				}
			});
		}
	}
}

function notificationDropdown_close() {
	const dropdown = document.getElementById("notificationDropdown");
	dropdown.classList.add("hidden");
}

const notificationDropdown_delete = () => {
	if (confirm("모든 알림을 삭제하시겠습니까?")) {
		$.ajax({
			url: "/deleteAllNotification",
			method: "POST",
			success: function(data) {
				if (data === "success") {
					toggleNotificationDropdown();
				} else {
					alert("삭제에 실패했습니다..");
				}
			},
			error: function(error) {
				console.error("알림 삭제 실패:", error);
			}

		})
	}
}

const notificationDropdown_one_delete = (notiId) => {
	if (confirm("선택한 알림을 삭제하시겠습니까?")) {
		$.ajax({
			url: "/deleteOneNotification",
			method: "POST",
			data: { "notiId": notiId },
			success: function(data) {
				if (data === "success") {
					fetchNotifications();
				} else {
					alert("삭제에 실패했습니다..");
				}
			},
			error: function(error) {
				console.error("알림 삭제 실패:", error);
			}

		})
	}
}

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

document.addEventListener("DOMContentLoaded", () => {
	userNameSide = window.model?.userName || '사용자';
	pageTitleSide = window.model?.headerText || '서비스 페이지';

	// --- 1. 헤더 생성 및 삽입을 먼저 수행하여 toggleSidebarBtn_2가 DOM에 존재하도록 함 ---
	const headerHTML = `
        <div class="serviceChart-header">
            <div class="serviceChart-header-left">
                <button class="toggleSidebarBtn_header" id="toggleSidebarBtn_2">
                    <i class="bi bi-layout-sidebar"></i>
                </button>
                <h2>실내공기질 ${pageTitleSide}</h2>
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

	// --- 2. 이제 헤더 버튼 요소를 가져올 수 있음 ---
	const toggleBtn_header = document.getElementById("toggleSidebarBtn_2"); // 이제는 null이 아님!

	// --- 3. 사이드바 생성 및 삽입 ---
	const sidebar = document.createElement('aside');
	sidebar.className = 'sidebar';

	const sidebar_button_1 = document.createElement('div');
	sidebar_button_1.className = 'sidebar_button_container';
	sidebar_button_1.innerHTML = `<button id="toggleSidebarBtn" class="toggleSidebarBtn_sidebar">
        <i class="bi bi-layout-sidebar"></i>
    </button>`;
	sidebar.appendChild(sidebar_button_1);

	const logo = document.createElement('div');
	logo.className = 'sidebar-logo';
	logo.innerHTML = `<h3>실내공기질<br>${pageTitleSide}</h3>`;
	sidebar.appendChild(logo);

	const profile = document.createElement('div');
	profile.className = 'sidebar-profile';

	const img = document.createElement('img');
	img.src = "./img/profile.png";
	img.alt = "profile icon";
	profile.appendChild(img);

	const welcome = document.createElement('div');
	welcome.className = 'sidebar-welcome';
	welcome.innerHTML = `<h5>${userNameSide}님<br>환영합니다!</h5>`;

	const profileWrapper = document.createElement('div');
	profileWrapper.className = 'sidebar-profile-wrapper';

	const profileLink = document.createElement('a');
	profileLink.href = '/update';
	profileLink.style.textDecoration = 'none';
	profileLink.style.color = 'inherit';

	profileLink.appendChild(profile);
	profileLink.appendChild(welcome);
	profileWrapper.appendChild(profileLink);

	sidebar.appendChild(profileWrapper);

	function goMonitoringPage() {
		window.location.href = '/service';
	}

	function onIndoorAirPredictClick() {
		window.location.href = '/servicePred';
	}

	const buttons = [
		{ text: '모니터링 시스템', onClick: goMonitoringPage },
		{ text: '조회 시스템', onClick: onIndoorAirPredictClick }
	];

	buttons.forEach(({ text, onClick }) => {
		const button = document.createElement('button');
		button.className = 'sidebar-button';
		button.textContent = text;
		button.onclick = onClick;
		sidebar.appendChild(button);
	});

	const mainPage = document.querySelector('.service-main-page');
	const container = document.getElementById('sidebar-container');
	container.appendChild(sidebar);

	const toggleBtn_sidebar = document.getElementById("toggleSidebarBtn");

	function updateSidebarState(isOpen) {
		const mainChart = document.getElementById('chart-dust-main-echarts'); // 요소를 변수에 저장
		if (isOpen) {
			if (toggleBtn_header) { // null 체크 추가
				//toggleBtn_header.style.visibility = "hidden"; // 사이드바 열릴 때 헤더 버튼 숨김
				toggleBtn_header.style.display = "none"; // 사이드바 열릴 때 헤더 버튼 숨김
			}
			container.classList.add("active");
			mainPage.style.marginLeft = "clamp(200px, 20vw, 300px)";
			if (mainChart) {
				document.getElementById('chart-dust-main-echarts').style.width = 'calc(100% - clamp(200px, 20vw, 300px))';
			}
		} else {
			if (toggleBtn_header) { // null 체크 추가
				//toggleBtn_header.style.visibility = "visible"; // 사이드바 닫힐 때 헤더 버튼 보임
				toggleBtn_header.style.display = "block"; // 사이드바 닫힐 때 헤더 버튼 보임
			}
			container.classList.remove("active");
			mainPage.style.marginLeft = "0";
			if (mainChart) {
				document.getElementById('chart-dust-main-echarts').style.width = "100%";
			}
		}

		// 차트 리사이즈
		setTimeout(() => {
			if (dustEChart) dustEChart.resize();
			if (pm1EChart) pm1EChart.resize();
			if (pm25EChart) pm25EChart.resize();
			if (pm10EChart) pm10EChart.resize();
			if (codenEChart) codenEChart.resize();
			if (co2denEChart) co2denEChart.resize();
		}, 1);
	}

	const storedSidebarState = localStorage.getItem('sidebarOpen');
	const isSidebarOpen = storedSidebarState === null ? true : storedSidebarState === 'true';

	updateSidebarState(isSidebarOpen); // 초기 상태 적용

	const sidebarOpenButton = () => {
		const currentlyOpen = container.classList.contains("active");
		const newState = !currentlyOpen;
		updateSidebarState(newState);
		localStorage.setItem('sidebarOpen', newState);
	}

	// --- 4. 이벤트 리스너 부착 (이제 요소가 존재함) ---
	if (toggleBtn_sidebar) { // null 체크
		toggleBtn_sidebar.addEventListener("click", sidebarOpenButton);
	} else {
		console.error("ID 'toggleSidebarBtn'을 가진 사이드바 버튼을 찾을 수 없습니다.");
	}

	if (toggleBtn_header) { // null 체크
		toggleBtn_header.addEventListener("click", sidebarOpenButton);
	} else {
		console.error("ID 'toggleSidebarBtn_2'를 가진 헤더 버튼을 찾을 수 없습니다.");
	}


	fetchNotifications();
	setInterval(fetchNotifications, 3000);
});	



function fetchNotifications() {  // 전역 함수로 이동
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