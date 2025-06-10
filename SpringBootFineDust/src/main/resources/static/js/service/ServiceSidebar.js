document.addEventListener("DOMContentLoaded", function() {
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

    // 사이드바 상태 업데이트 함수
    function updateSidebarState(isOpen) {
        if (isOpen) {
            container.classList.add("active");
            mainPage.style.marginLeft = "clamp(200px, 20vw, 300px)";
            // CSS calc() 문자열 할당. JavaScript에서 직접 계산은 복잡하므로 CSS에 맡김.
            document.getElementById('chart-dust-main-echarts').style.width = 'calc(100% - clamp(200px, 20vw, 300px))';
        } else {
            container.classList.remove("active");
            mainPage.style.marginLeft = "0";
            document.getElementById('chart-dust-main-echarts').style.width = "100%";
        }

        // 차트 리사이즈 (차트 객체가 전역 스코프에 있다고 가정)
        setTimeout(() => {
            if (dustEChart) dustEChart.resize();
            if (pm1EChart) pm1EChart.resize();
            if (pm25EChart) pm25EChart.resize();
            if (pm10EChart) pm10EChart.resize();
            if (codenEChart) codenEChart.resize();
            if (co2denEChart) co2denEChart.resize();
        }, 1);
    }

    // 페이지 로드 시 로컬 스토리지에서 사이드바 상태 불러오기
    // 값이 없거나 null인 경우 'true'로 기본 설정 (열린 상태)
    const storedSidebarState = localStorage.getItem('sidebarOpen');
    const isSidebarOpen = storedSidebarState === null ? true : storedSidebarState === 'true';

    // 초기 상태 적용
    updateSidebarState(isSidebarOpen);

    // 토글 버튼 클릭 이벤트
    toggleBtn.addEventListener("click", function() {
        const currentlyOpen = container.classList.contains("active");
        const newState = !currentlyOpen; // 새로운 상태 (토글)
        updateSidebarState(newState); // UI 업데이트
        localStorage.setItem('sidebarOpen', newState); // 로컬 스토리지에 새로운 상태 저장
    });
});