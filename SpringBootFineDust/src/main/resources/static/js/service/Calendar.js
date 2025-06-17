const calendarBody = document.getElementById("calendar-body");
const monthYear = document.getElementById("month-year");
let currentDate = new Date();

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

function pad(num) {
	return String(num).padStart(2, "0");
}

function renderCalendar(date) {
	calendarBody.innerHTML = "";
	const year = date.getFullYear();
	const month = date.getMonth();
	const firstDay = new Date(year, month, 1).getDay();
	const lastDate = new Date(year, month + 1, 0).getDate();
	monthYear.textContent = `${year}년 ${month + 1}월`;

	let day = 1;
	for (let i = 0; i < 6; i++) {
		const row = document.createElement("tr");
		for (let j = 0; j < 7; j++) {
			const cell = document.createElement("td");
			cell.classList.add("calendar-cell");

			if (i === 0 && j < firstDay || day > lastDate) {
				cell.innerHTML = "";
			} else {
				const thisDate = new Date(year, month, day);
				// 어제 날짜까지만 선택 가능하도록 비활성화 처리
				if (thisDate > yesterday) {
					cell.innerHTML = `<div class="day-circle disabled">${day}</div>`;
					cell.querySelector(".day-circle").style.color = "#ccc";
					cell.querySelector(".day-circle").style.cursor = "not-allowed";
				} else {
					const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
					const dayCircle = document.createElement("div");
					dayCircle.classList.add("day-circle");
					dayCircle.textContent = day;

					function getWeekdayName(dateStr) {
						const date = new Date(dateStr);
						const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
						return days[date.getDay()];
					}

					dayCircle.addEventListener("click", () => {

						let lastClickedDate = null;

						document.getElementById('chart-loading-main').style.display = 'block';
						document.getElementById('initial-message').style.display = 'none';
						document.getElementById('dustAccordion').style.display = 'none';

						const weekday = getWeekdayName(dateStr);

						/* 불러오기 collapse if ~ 닫히게 하기 */
						const dustCard = document.getElementById("dustCard");
						const bsCollapse = bootstrap.Collapse.getOrCreateInstance(dustCard);

						if (lastClickedDate === dateStr && bsCollapse._isShown) {
							bsCollapse.hide();
							lastClickedDate = null; // 초기화
							return;
						}

						// 다른 날짜 클릭했거나 처음 열 때는 => 열기 + 데이터 갱신
						lastClickedDate = dateStr;
						fetch(`/dust-data/${dateStr}`)
							.then(res => res.json())
							.then(data => {
								const title = document.getElementById("headingDust");
								const detail = document.getElementById("dust-detail");

								title.textContent = `${dateStr} (${weekday}) 미세먼지 평균 정보`;

								if (!data || data.length === 0) {
									detail.innerHTML = `<p>데이터가 없습니다.</p>`;
									return;
								}

								const dustCard = document.getElementById("dustCard");
								const bsCollapse = bootstrap.Collapse.getOrCreateInstance(dustCard);
								bsCollapse.show();

								detail.innerHTML = `
								  <ul class="pm-list">
								    <li>
								      <div class="pm-title">☀️ 오전 평균</div>
								      <div class="pm-item">🌫 PM1: <span>${data[0].amAvgPm1 ?? 'N/A'}</span></div>
								      <div class="pm-item">🌫 PM2.5: <span>${data[0].amAvgPm25 ?? 'N/A'}</span></div>
								      <div class="pm-item">🌫 PM10: <span>${data[0].amAvgPm10 ?? 'N/A'}</span></div>
								    </li>
								    <li>
								      <div class="pm-title">🌇 오후 평균</div>
								      <div class="pm-item">🌫 PM1: <span>${data[0].pmAvgPm1 ?? 'N/A'}</span></div>
								      <div class="pm-item">🌫 PM2.5: <span>${data[0].pmAvgPm25 ?? 'N/A'}</span></div>
								      <div class="pm-item">🌫 PM10: <span>${data[0].pmAvgPm10 ?? 'N/A'}</span></div>
								    </li>
								  </ul>
								`;
								barChartSho(weekday);

								document.getElementById('chart-loading-main').style.display = 'none';
								document.getElementById('dustAccordion').style.display = 'block';
							});
					});

					cell.appendChild(dayCircle);
				}
				day++;
			}

			row.appendChild(cell);
		}
		calendarBody.appendChild(row);
		if (day > lastDate) break;
	}
}

function changeMonth(offset) {
	currentDate.setMonth(currentDate.getMonth() + offset);
	renderCalendar(currentDate);
}

renderCalendar(currentDate);
