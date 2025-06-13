/**
 * 
 */

const calendarBody = document.getElementById("calendar-body");
const monthYear = document.getElementById("month-year");
let currentDate = new Date();

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

			if (i === 0 && j < firstDay || day > lastDate) {
				cell.innerHTML = "";
			} else {
				const thisDate = new Date(year, month, day);
				const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
				const dayCircle = document.createElement("div");
				dayCircle.classList.add("day-circle");
				dayCircle.textContent = day;

				function getWeekdayName(dateStr) {
					const date = new Date(dateStr);
					const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
					return days[date.getDay()];
				}
				/* 클릭시 닫히게 하기 */
				let lastClickedDate = null;

				dayCircle.addEventListener("click", () => {
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
							const title = document.getElementById("collapse-title");
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
  <table style="
    border-collapse: collapse; 
    width: 100%; 
    text-align: center; 
    border: 1px solid #ccc;
  ">
    <thead>
      <tr>
        <th style="border: 1px solid #ccc; padding: 8px;"></th>
        <th style="border: 1px solid #ccc; padding: 8px;">PM1</th>
        <th style="border: 1px solid #ccc; padding: 8px;">PM2.5</th>
        <th style="border: 1px solid #ccc; padding: 8px;">PM10</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th style="border: 1px solid #ccc; padding: 8px;">오전 평균</th>
        <td style="border: 1px solid #ccc; padding: 8px;">${data[0].amAvgPm1 ?? 'N/A'}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${data[0].amAvgPm25 ?? 'N/A'}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${data[0].amAvgPm10 ?? 'N/A'}</td>
      </tr>
      <tr>
        <th style="border: 1px solid #ccc; padding: 8px;">오후 평균</th>
        <td style="border: 1px solid #ccc; padding: 8px;">${data[0].pmAvgPm1 ?? 'N/A'}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${data[0].pmAvgPm25 ?? 'N/A'}</td>
        <td style="border: 1px solid #ccc; padding: 8px;">${data[0].pmAvgPm10 ?? 'N/A'}</td>
      </tr>
    </tbody>
  </table>
`;    	barChartSho(weekday);
	

						});
				});

				cell.appendChild(dayCircle);
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
