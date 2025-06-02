// 사이드바 생성
const userName = window.model?.userName || '사용자';
  
const sidebar = document.createElement('aside');
sidebar.className = 'sidebar';

// 로고
const logo = document.createElement('div');
logo.className = 'sidebar-logo';
logo.innerHTML = '<strong>실내공기질<br>측정시스템</strong>';
sidebar.appendChild(logo);

// 프로필 영역
const profile = document.createElement('div');
profile.className = 'sidebar-profile';

const img = document.createElement('img');
img.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
img.alt = "profile icon";

profile.appendChild(img);

// 환영 메시지
const welcome = document.createElement('div');
welcome.className = 'sidebar-welcome';
welcome.innerHTML = `<strong>${userName}님<br>환영합니다!</strong>`;

// 프로필과 환영 메시지를 감싸는 div 생성
const profileWrapper = document.createElement('div');
profileWrapper.className = 'sidebar-profile-wrapper';

// a 태그 생성 및 설정
const profileLink = document.createElement('a');
profileLink.href = '/update';
profileLink.style.textDecoration = 'none';
profileLink.style.color = 'inherit';

// profile과 welcome을 profileWrapper에 추가
profileLink.appendChild(profile);
profileLink.appendChild(welcome);
profileWrapper.appendChild(profileLink);

// profileWrapper를 사이드바에 추가
sidebar.appendChild(profileWrapper);

// 버튼들
const buttons = [
  '실시간 데이터 차트',
  '실내공기 예측 차트',
  '실내공기 종합 차트',
  '역사/시간대별 모니터링',
  '트렌드 분석'
];

buttons.forEach(text => {
  const button = document.createElement('button');
  button.className = 'sidebar-button';
  button.textContent = text;
  button.addEventListener('click', () => {
    console.log(`${text} 버튼 클릭됨`);
  });
  sidebar.appendChild(button);
});

// 생성된 사이드바를 body에 추가
document.body.appendChild(sidebar);
