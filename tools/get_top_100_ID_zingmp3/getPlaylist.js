javascript:((function(){
    if(window.location.hostname != 'mp3.zing.vn')
			window.alert('this tool only work at mp3.zing.vn');
	else {
    	try{
    		var x = document.getElementsByClassName('fn-item', 'group');
    		var arr = [];
    		for(var i = 1; i < x.length-3; i++){
    			try{
    				var name = x[i].children[1].children[1].children[0].attributes[2].value
    					.replace(" - undefined", " - " + x[i].children[1].children[2].children[0].children[0].textContent)
    					.replace(/\'|\"/g," ");
    				var id = x[i].attributes[4].value;
    				console.log(i+ ":  "+name+" : "+id);
    				arr.push({"name":name, "id":id});
    			} catch(e){
    				console.log(i+ ":  ERROR"+e);
    			}
    		}
    		var nameL = prompt("Name of playlist you want to save :");
    		nameL += "-playlist";
    		var myWindow = window.open("", "MsgWindow", "width=400,height=500");
    
    		myWindow.document.write("<p>{\"nameList\": \""+ nameL +"\",</p>");
    		myWindow.document.write("<p>\"SongList\": [</p>");
    		for(var i = 0; i < arr.length; i++){
    			myWindow.document.write("<p>{\"name\":\""+arr[i].name+ '\" , \"id\":\"'+ arr[i].id +"\"}"+(i==arr.length-1?"":",")+"</p>");
    		}
    		myWindow.document.write("<p>]}</p>");
    	}
    	catch(e){
    		alert("ERROR: "+ e);
    	}
	} 
})())