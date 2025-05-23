$(".ptd").on("click", request);

function request(){
	const idx = $(this).closest("tr").find("td").eq(0).html();
	console.log(idx);
	
	$.ajax({
		url : "desc",
		data : {
			"idx" : idx
		},
		type : "get",
		success : function(res){
			console.log(res);
			$('#result').val(res);
		},
		error : function(){
			alert('err...');
		}
	})
}
