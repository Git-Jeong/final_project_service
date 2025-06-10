document.addEventListener("DOMContentLoaded", function() {
	// DOM 완전 로드 후에 실행되도록 이동

	const userNameSide = window.model?.userName || '사용자';
	const pageTitleSide = window.model?.headerText || '서비스 페이지';

	const sidebar = document.createElement('aside');
	sidebar.className = 'sidebar';

	const logo = document.createElement('div');
	logo.className = 'sidebar-logo';
	logo.innerHTML = `<strong>실내공기질<br>${pageTitleSide}</strong>`;
	sidebar.appendChild(logo);

	const profile = document.createElement('div');
	profile.className = 'sidebar-profile';

	const img = document.createElement('img');
	img.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
	img.alt = "profile icon";
	profile.appendChild(img);

	const welcome = document.createElement('div');
	welcome.className = 'sidebar-welcome';
	welcome.innerHTML = `<strong>${userNameSide}님<br>환영합니다!</strong>`;

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
		{ text: '실시간 데이터 차트', onClick: goMonitoringPage },
		{ text: '실내공기 예측 차트', onClick: onIndoorAirPredictClick }
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

	const toggleBtn = document.getElementById("toggleSidebarBtn");
		toggleBtn.addEventListener("click", function() {
			container.classList.toggle("active");
		if (container.classList.contains("active")) {
			mainPage.style.marginLeft = "clamp(200px, 20vw, 300px)";
			document.getElementById('chart-dust-main-echarts').style.width = `calc(100% - clamp(200px, 20vw, 300px))`;
		} else {
			mainPage.style.marginLeft = "0";
			document.getElementById('chart-dust-main-echarts').style.width = "100%";
		} 
	});
});
