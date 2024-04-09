(function(){
	try{
		var x = document.getElementsByClassName('fn-item', 'group');
		for(var i = 1; i < x.length-3; i++){
			var name = x[i].children[1].children[1].children[0].attributes[2].value
				.replace(" - undefined", " - " + x[i].children[1].children[2].children[0].children[0].textContent);
			var id = x[i].attributes[4].value;
			console.log(name+" : "+id);
		}
	}
	catch(e){
		alert("ERROR: "+ e);
	}
})();