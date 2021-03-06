var myCodeMirror;
function init(code) {
	console.log(code); 
	myCodeMirror = CodeMirror(document.getElementById('editor'), {
		value: he.decode(code),
		lineNumbers: true,
		mode:  "javascript"
	});
}


$(document).on('click', '#submitEdit', function(e) {
	e.preventDefault();
	$('#inputDesc').val(myCodeMirror.getValue());
	$("#editForm").submit();
});

$(document).on('click', '#submitBtn', function(e) {
	e.preventDefault();
	$('#inputDesc').val(myCodeMirror.getValue());
	$("#submitForm").submit();
});

$(document).on('change', '#categoryList', function(e) {
	switch(this.options[e.target.selectedIndex].text.toLowerCase()) {
		case 'Javascript':
		myCodeMirror.setOption("mode", 'javascript');
			break;
		case 'HMTL':
		myCodeMirror.setOption("mode", 'html');
			break;
		case 'CSS':
		myCodeMirror.setOption("mode", 'css');
			break;
		case 'Other':
		myCodeMirror.setOption("mode", 'javascript');
			break;
		default:
			break;
	}
});

$(document).on('click', '#copyBtn', function() {
	
});