const calendarBody = document.getElementById("calendar-body");
const monthYear = document.getElementById("month-year");
let currentDate = new Date();
let lastClickedDate = null;

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 0);

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
					function getWeekdayKoreanName(dateStr) {
						const weekdays = ['일', '월', '화', '수', '목', '금', '토']; // 한국어 요일
						const date = new Date(dateStr);
						return weekdays[date.getDay()];
					} dayCircle.addEventListener("click", () => {
						document.getElementById('chart-loading-main').style.display = 'block';
						document.getElementById('chartList-loading').style.display = 'block';
						document.getElementById('initial-message').style.display = 'none';
						document.getElementById('dustAccordion').style.display = 'none';
						document.getElementById('chartList').style.display = 'none';

						const weekday = getWeekdayName(dateStr);
						const weekdayKorean = getWeekdayKoreanName(dateStr);

						const dustCard = document.getElementById("dustCard");
						const bsCollapse = bootstrap.Collapse.getOrCreateInstance(dustCard);

						if (lastClickedDate === dateStr && bsCollapse._isShown) {
							bsCollapse.hide();
							lastClickedDate = null;
							return;
						}

						lastClickedDate = dateStr;

						const todayStr = new Date().toISOString().slice(0, 10);
						if (dateStr === todayStr) {
							const title = document.getElementById("headingDust");
							const detail = document.getElementById("dust-detail");
							title.textContent = `${dateStr} (${weekdayKorean}) 미세먼지 평균 정보`;
							detail.innerHTML = `
							  <ul class="pm-list" style="height: 150px;">
							    <li>
							      <p class="no-data-message">
							        아직 하루가 지나지 않아\n계산된 데이터가 없습니다.\n다른 날짜를 선택해 주세요.
							      </p>
							    </li>
							  </ul>
							`;


							barChartSho(weekday, dateStr);
							barChartShoCo(weekday, dateStr);

							document.getElementById('chart-loading-main').style.display = 'none';
							document.getElementById('dustAccordion').style.display = 'block';
							return;
						}

						fetch(`/dust-data/${dateStr}`)
							.then(res => res.json())
							.then(data => {
								const title = document.getElementById("headingDust");
								const detail = document.getElementById("dust-detail");

								title.textContent = `${dateStr} (${weekdayKorean}) 미세먼지 평균 정보`;

								if (!data || data.length === 0) {
									detail.innerHTML = `<p>데이터가 없습니다.</p>`;
									return;
								}

								dustCard.style.display = "block";
								bsCollapse.show();

								detail.innerHTML = `
								  <ul class="pm-list">
								    <li>
								      <div class="pm-title"> 오전 / 오후 평균</div>
								      <div class="pm-item" data-label="🌪️ PM10:" data-unit="㎍/㎥">
								        <span><span style="color:#f39c12;">☀️</span> ${data[0].amAvgPm10 !== undefined && data[0].amAvgPm10 !== null ? data[0].amAvgPm10.toFixed(1) : 'N/A'}</span>
								        <span><span style="color:#8e44ad;">🌃</span> ${data[0].pmAvgPm10 !== undefined && data[0].pmAvgPm10 !== null ? data[0].pmAvgPm10.toFixed(1) : 'N/A'}</span>
								      </div>
								      <div class="pm-item" data-label="🌁 PM2.5:" data-unit="㎍/㎥">
								        <span><span style="color:#f39c12;">☀️</span> ${data[0].amAvgPm25 !== undefined && data[0].amAvgPm25 !== null ? data[0].amAvgPm25.toFixed(1) : 'N/A'}</span>
								        <span><span style="color:#8e44ad;">🌃</span> ${data[0].pmAvgPm25 !== undefined && data[0].pmAvgPm25 !== null ? data[0].pmAvgPm25.toFixed(1) : 'N/A'}</span>
								      </div>
								      <div class="pm-item" data-label="🌫️ PM1.0:" data-unit="㎍/㎥">
								        <span><span style="color:#f39c12;">☀️</span> ${data[0].amAvgPm1 !== undefined && data[0].amAvgPm1 !== null ? data[0].amAvgPm1.toFixed(1) : 'N/A'}</span>
								        <span><span style="color:#8e44ad;">🌃</span> ${data[0].pmAvgPm1 !== undefined && data[0].pmAvgPm1 !== null ? data[0].pmAvgPm1.toFixed(1) : 'N/A'}</span>
								      </div>
								      <div class="pm-item" data-label="🫁 CO₂:" data-unit="ppm">
								        <span><span style="color:#f39c12;">☀️</span> ${data[0].amAvgCo2den !== undefined && data[0].amAvgCo2den !== null ? data[0].amAvgCo2den.toFixed(1) : 'N/A'}</span>
								        <span><span style="color:#8e44ad;">🌃</span> ${data[0].pmAvgCo2den !== undefined && data[0].pmAvgCo2den !== null ? data[0].pmAvgCo2den.toFixed(1) : 'N/A'}</span>
								      </div>
								    </li>
								  </ul>
								`;
								barChartSho(weekday, dateStr);
								barChartShoCo(weekday, dateStr);

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
