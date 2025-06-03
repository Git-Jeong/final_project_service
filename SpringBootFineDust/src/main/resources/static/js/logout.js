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
