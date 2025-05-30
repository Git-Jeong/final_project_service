// 사이드바 생성
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
sidebar.appendChild(profile);

// 환영 메시지
const welcome = document.createElement('div');
welcome.className = 'sidebar-welcome';
welcome.innerHTML = '<strong>김윤서님<br>환영합니다!</strong>';
sidebar.appendChild(welcome);

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
  sidebar.appendChild(button);
});

// 생성된 사이드바를 body에 추가
document.body.appendChild(sidebar);
