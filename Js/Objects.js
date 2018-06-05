function InfoSong() {
	this.avatar;
	this.title;
	this.medialink;
	
	this.lyrics;
	this.lyricNow = '';
	this.lyricNext ='';
	this.index = 0;

	this.updateLyric = function(){
		if(this.lyrics){
			var found = false;
			var index = 0;
			for(var i = 1; i < this.lyrics.length; i++){
				if(this.lyrics[i][0] == '[' && this.lyrics[i][9] == ']' 
				&& this.lyrics[i][3] == ':' && this.lyrics[i][6] == '.'){
					var timelyric = '';
					for(var j = 2; j <= 8; j++)
						timelyric += this.lyrics[i][j];
				
					if(time(true) <= timelyric){
						found = true;
						index = i-1;
						break;					
					}
				}
			}
			if(found && this.index != index){
				this.index = index;
				this.lyricNow = '';
				for(var i = 10; i < this.lyrics[index].length; i++)
					this.lyricNow += this.lyrics[index][i];
				
				this.lyricNext = '';
				if(this.lyrics[index+1] != null){
					for(var i = 10; i < this.lyrics[index+1].length; i++)
						this.lyricNext += this.lyrics[index+1][i];
				}
			}
		}
	}

	this.updateData = function(newData){
		this.medialink = 'https:'+ newData.data.source[128];
		this.title = newData.data.title + " - " + newData.data.artists_names;
		this.avatar = loadImage(newData.data.thumbnail);
		console.log(this.title+"\n"+this.medialink);
		console.log("lyric file\n" + newData.data.lyric);
		console.log("avatar\n"+newData.data.thumbnail);
		this.getLyric(newData.data.lyric);
	}

	this.setTitle = function(fileName, isFile){
		if(isFile == 'file')
			this.title = fileName.substring(0, fileName.length-4);
		else this.title = fileName;
		this.avatar = null;
		this.medialink = null; // file offline 
		this.lyrics = null;
		this.lyricNow = '';
		this.lyricNext ='';
	}

	this.setAva = function(link){
		this.avatar = loadImage(link);
	}

	this.getLyric = function(url){
		if(url) this.lyrics = loadStrings(url);
		else {
			this.lyrics = null;
			this.lyricNow = '';
			this.lyricNext ='';
		}
	}
}

//============     Text Box      ==================
function textBox(x, y, w, h, textInside, typeIn){
	this.objectType = typeIn;
	this.pos = createVector(x, y);
	this.size = createVector(w, h);
	this.textInside = textInside;
	this.id = objects.length;
	this.boxcontain = new BoxContain(this);

	this.show = function(){
		strokeWeight(1);
		textSize(this.size.y);
		noStroke();
		if(typeIn == 'title' || typeIn == 'text'){
			if(typeIn == 'title'){
				this.textInside = info.title;
				fill(VisualizeGui.titleColor);
			} else fill(VisualizeGui.textColor);
			text(this.textInside, this.pos.x, this.pos.y);
		
		} else if(typeIn == 'time'){
			fill(VisualizeGui.timeColor);
			text(time(false), this.pos.x, this.pos.y);
		
		} else if(typeIn == 'lyric'){
			info.updateLyric();
			fill(VisualizeGui.lyricColor);
			text(info.lyricNow, this.pos.x, this.pos.y);
			fill(VisualizeGui.lyricColor2);
			textSize(this.size.y-3);
			text(info.lyricNext, this.pos.x, this.pos.y+this.size.y+10);
		}
		textSize(20); // set textSize to default
	}

	// when delete one object , ID will change
	this.updateID = function(newID){
		this.id = newID;
	}

	this.setPosition = function(x, y){
		this.pos = createVector(x, y);
	}

	this.setSize = function(w, h){
		this.size = createVector(w, h);
	}

	this.run = function(){
		this.show();

		if(designMode)
			this.boxcontain.show();
	}
}

//============     Buttons      ================
function ButtonShape(x, y, w, h, name, funcMouseOn, whenClick) {
	this.objectType = 'ButtonShape';
	this.pos = createVector(x, y);
	this.size = createVector(w, h);
	this.id = objects.length;
	this.name = name;
	this.boxcontain = new BoxContain(this);

	this.clicked = function(){
		if(isPointInsideRect2(v(mouseX, mouseY), this.pos, this.size)){
			whenClick();
		}
	}

	this.show = function(){
		// show current state if this button is Play/Pause button
		if(this.name != 'Next' & this.name != 'Pre'){
			if(myAudio.elt.networkState == 1 && myAudio.elt.readyState == 4)
			{
				if(myAudio.elt.paused)
					this.name = "Play";
				else this.name = "Pause";
			}
			else if(myAudio.src){
				var loading = "Loading";
				var timeAnimation = (millis()/200)%(loading.length);
				var textAnimation = "";
				for(var i = 0; i < timeAnimation; i++){
					textAnimation += loading[i];
				}
				this.name = textAnimation;
			}
		}
		// show button shape
		if(!designMode && isPointInsideRect2(v(mouseX, mouseY), this.pos, this.size)){
			if(funcMouseOn)
				funcMouseOn();
			fill(color('hsba(200, 100%, 100%, 0.4)'));
		}
		else noFill();

		stroke(255);
		strokeWeight(1);
		rect(this.pos.x, this.pos.y, this.size.x, this.size.y);

		textSize(this.size.y/2);
		if(this.name == 'Next' || this.name == 'Pre'){
			fill(255);
			noStroke();
		}
 		text(this.name, this.pos.x, this.pos.y);
		textSize(20);
	}

	// when delete one object , ID will change
	this.updateID = function(newID){
		this.id = newID;
	}

	this.setPosition = function(x, y){
		this.pos = createVector(x, y);
	}

	this.setSize = function(w, h){
		this.size = createVector(w, h);
	}

	this.run = function(){
		this.show();

		if(designMode)
			this.boxcontain.show();
	}
}

//============     Visualize Graph      =================
function AmplitudeGraph(x, y, w, h, type) {
	this.objectType = 'AmplitudeGraph';
	this.pos = createVector(x, y);
	this.size = createVector(w, h);
	this.id = objects.length;
	this.type = type;

	this.boxcontain = new BoxContain(this);

	this.show = function(){
		var r = map(ampLevel, 0, 0.5, 0, this.size.y);
		
		fill(255-map(ampLevel, 0, 0.5, 0, 255), 255, 255);
		noStroke();

		switch(this.type){
			case "singleRect" : 
				rect(this.pos.x, this.pos.y-r/2+this.size.y/2, this.size.x, r);
				break;

			case "singleRect_Ngang":
				var rNgang = map(ampLevel, 0, 0.5, 0, this.size.x);
				rect(this.pos.x-rNgang/2+this.size.x/2, this.pos.y, rNgang, this.size.y);
				break;

			case "circle" :
				ellipse(this.pos.x, this.pos.y, r, r);
				break;

			case "starMoving":
				break;

			case "lineGraph" :
				if(! this.graph)
					this.graph = [];
				this.graph.push(ampLevel*1.5);
				while(this.graph.length > this.size.x/5)
					this.graph.splice(0, 1);

				strokeWeight(3);
				noFill();
				var dis = this.size.x/(this.size.x/5);
				var y, y2;
				for(var i = 0; i < this.graph.length-1; i++){
					y = map(this.graph[i], 0, 1, -this.size.y/2, this.size.y/2);
					y2 = map(this.graph[i+1], 0, 1, -this.size.y/2, this.size.y/2);

					stroke(map(this.graph[i], 0, 0.5, 255, 0), 255, 255);
					line(i*dis+(this.pos.x-this.size.x/2), this.pos.y-y, 
						(i+1)*dis+(this.pos.x-this.size.x/2), this.pos.y-y2);
				}
				// circle at end graph
				fill(255);
				ellipse(this.pos.x+this.size.x/2, this.pos.y-y, 12, 12);
				break;

		}
	}

	// when delete one object , ID will change
	this.updateID = function(newID){
		this.id = newID;
	}

	this.setPosition = function(x, y){
		this.pos = createVector(x, y);
	}

	this.setSize = function(w, h){
		this.size = createVector(w, h);
	}

	this.run = function(){
		if(ampLevel)
			this.show();

		if(designMode)
			this.boxcontain.show();
	}
}

function fftGraph(x, y, w, h, type){
	this.objectType = 'fftGraph';
	this.pos = createVector(x, y);
	this.size = createVector(w, h);
	this.type = type;
	this.id = objects.length;

	this.boxcontain = new BoxContain(this);

	this.show = function(){
		switch(this.type){
			case "center":
				var barWidth = this.size.x/(fftAnalyze.length);
				strokeWeight(abs(barWidth));

				for(var i = 0; i < fftAnalyze.length; i++){
					var len = map(fftAnalyze[i], 0, 255, 0, this.size.y);
					
					stroke(color('hsba('+ (255-fftAnalyze[i]) +', 100%, 100%, 0.7)'));
					var x1 = i*barWidth+(this.pos.x-this.size.x/2)+barWidth/2;
					var y1 = this.pos.y;
					line(x1, y1-len/2-1, x1, y1+len/2);
				}
				break;

			case "center noColor":
				var barWidth = this.size.x/(fftAnalyze.length);
				stroke(255);
				strokeWeight(2);

				for(var i = 0; i < fftAnalyze.length; i++){
					var len = map(fftAnalyze[i], 0, 255, 0, this.size.y);
					
					var x1 = i*barWidth+(this.pos.x-this.size.x/2)+barWidth/2;
					var y1 = this.pos.y;
					line(x1, y1-len/2-1, x1, y1+len/2);
				}
				break;

			case "bottom":
				var y;
				var barWidth = this.size.x/(fftAnalyze.length);
				strokeWeight(abs(barWidth));

				for(var i = 0; i < fftAnalyze.length; i++){
					y = map(fftAnalyze[i], 0, 255, 0, this.size.y);

					stroke(color('hsba('+ (255-fftAnalyze[i]) +', 100%, 100%, 0.7)'));
					var x1 = i*barWidth+(this.pos.x-this.size.x/2)+barWidth/2;
					var y1 = this.pos.y+this.size.y/2-y;
					var x2 = x1;
					var y2 = this.pos.y+this.size.y/2+1;
					line(x1, y1, x2, y2);
				}
				break;

			case "bottom noColor":
				var y;
				var barWidth = this.size.x/(fftAnalyze.length);
				stroke(255);
				strokeWeight(2);

				for(var i = 0; i < fftAnalyze.length; i++){
					y = map(fftAnalyze[i], 0, 255, 0, this.size.y);

					var x1 = i*barWidth+(this.pos.x-this.size.x/2)+barWidth/2;
					var y1 = this.pos.y+this.size.y/2-y;
					var x2 = x1;
					var y2 = this.pos.y+this.size.y/2+1;
					line(x1, y1, x2, y2);
				}
				break;

			case "circle moving":
				if(!this.speedC) this.speedC = 1;
				else  this.speedC*=0.9;

				if(this.speedC < 7*20/frameRate()){
					this.speedC += ampLevel*20/frameRate();
					if(abs(this.speedC) <= 0.1) this.speedC*=2;
				}

				if(!this.angleC) this.angleC = 1;
				else this.angleC = (this.angleC+this.speedC)%360;

				if(mouseIsPressed && 
				dist(pmouseX, pmouseY, this.pos.x, this.pos.y) < max(this.size.x/2, 100)){
					stroke(255); strokeWeight(4);
					line(pmouseX, pmouseY, mouseX, mouseY);
					strokeWeight(8); point(mouseX, mouseY);

					if(mouseX > this.pos.x)
						this.speedC += (mouseY-pmouseY)/10;
					else this.speedC -= (mouseY-pmouseY)/10;
				}

			case "circle":
				var y;
				var len = fftAnalyze.length;
				var barWidth = this.size.x/len;

				push();
				translate(this.pos.x, this.pos.y);
				rotate(this.angleC);
				noFill();
				for(var i = 0; i < len; i+=2){
					stroke(color('hsba('+ (255-fftAnalyze[i]) +', 100%, 100%, 0.7)'));
					y = this.size.x/5+map(fftAnalyze[i], 0, 255, 0, this.size.y)*0.2;
					
					strokeWeight(9);
					point(y*cos(180/len*i), y*sin(180/len*i));
					point(y*cos(180/len*i+180), y*sin(180/len*i+180));

					strokeWeight(3);
					line((this.size.x/3+ampLevel*50)*cos(180/len*i),
							(this.size.x/3+ampLevel*50)*sin(180/len*i),
							y*cos(180/len*i), y*sin(180/len*i));
					line((this.size.x/3+ampLevel*50)*cos(180/len*i+180),
							(this.size.x/3+ampLevel*50)*sin(180/len*i+180),
							y*cos(180/len*i+180), y*sin(180/len*i+180));
				}
				ellipse(0, 0, this.size.x/3+ampLevel*100, this.size.x/3+ampLevel*100);
				pop();
				
				break;

			case "waveform":
				var y;
				var barWidth = this.size.x/(fftWave.length);
				stroke(255);
				strokeWeight(2);
				noFill();

				beginShape();
				for (var i = 0; i< fftWave.length; i++){
					var x = map(i, 0, fftWave.length, this.pos.x-this.size.x/2, this.pos.x+this.size.x/2);
					var y = map(fftWave[i], -1, 1, this.pos.y+this.size.y/2, this.pos.y-this.size.y/2);
					vertex(x,y);
				}
				endShape();
				break;
		}
	}

	// when delete one object , ID will change
	this.updateID = function(newID){
		this.id = newID;
	}

	this.setPosition = function(x, y){
		this.pos = createVector(x, y);
	}

	this.setSize = function(w, h){
		this.size = createVector(w, h);
	}

	this.run = function(){
		if(fftAnalyze)
			this.show();

		if(designMode)
			this.boxcontain.show();
	}
}

//=============  Playlist  ==================
var PlayList = [
	{
		"name" : "Relaxing sunday morning",
		"link" : "file : Playlist/Type/RelaxingSunday-playlist.json"
	},
	{
		"name" : "Piano & Rain sound",
		"link" : "file : Playlist/Type/Piano-RainSound-playlist.json"
	},
	{
		"name" : "Nhac tre Viet",
		"link" : "file : Playlist/Type/top_100_Nhac-Tre-playlist.json"
	},
	{
		"name" : "Hoa Ngu",
		"link" : "file : Playlist/Type/top_100_Hoa-Ngu-playlist.json"
	},
	{
		"name" : "Nhat Ban",
		"link" : "file : Playlist/Type/top_100_Nhat-Ban-playlist.json"
	},
	{
		"name" : "Han Quoc",
		"link" : "file : Playlist/Type/top_100_HanQuoc-playlist.json"
	},
	{
		"name" : "Nhac Phim US",
		"link" : "file : Playlist/Type/top_100_NhacPhim-USUK-playlist.json"
	},
	{
		"name" : "Pop US",
		"link" : "file : Playlist/Type/top_100_Pop-playlist.json"
	},
	{
		"name" : "Electric-Dance US",
		"link" : "file : Playlist/Type/top_100_Electric-Dance-playlist.json"
	},
	{
		"name" : "Trance-House-Techno US",
		"link" : "file : Playlist/Type/top_100_Trance-House-Techno-playlist.json"
	},
	{
		"name" : "R-B Soul US",
		"link" : "file : Playlist/Type/top_100_R-B-Soul-playlist.json"
	},
	{
		"name" : "Rap-HipHop US",
		"link" : "file : Playlist/Type/top_100_Rap-HipHop-playlist.json"
	},
	{
		"name" : "Rock US",
		"link" : "file : Playlist/Type/top_100_Rock-playlist.json"
	},
	{
		"name" : "Country US",
		"link" : "file : Playlist/Type/top_100_Country-playlist.json"
	},
	{
		"name" : "Piano",
		"link" : "file : Playlist/Type/top_100_Piano-playlist.json"
	},
	{
		"name" : "Classical",
		"link" : "file : Playlist/Type/top_100_Classical-playlist.json"
	},
	{
		"name" : "====== VietNamese Singer =====",
		"link" : ""
	},
	{
		"name" : "Bao Anh",
		"link" : "file : Playlist/Artists/BaoAnh-playlist.json"
	},
	{
		"name" : "Chi Dan",
		"link" : "file : Playlist/Artists/ChiDan-playlist.json"
	},
	{
		"name" : "Duc Phuc",
		"link" : "file : Playlist/Artists/DucPhuc-playlist.json"
	},
	{
		"name" : "Erik",
		"link" : "file : Playlist/Artists/Erik-playlist.json"
	},
	{
		"name" : "Ho Quang Hieu",
		"link" : "file : Playlist/Artists/HoQuangHieu-playlist.json"
	},
	{
		"name" : "Huong Tram",
		"link" : "file : Playlist/Artists/HuongTram-playlist.json"
	},
	{
		"name" : "Karik",
		"link" : "file : Playlist/Artists/Karik-playlist.json"
	},
	{
		"name" : "Khoi My",
		"link" : "file : Playlist/Artists/KhoiMy-playlist.json"
	},
	{
		"name" : "Min",
		"link" : "file : Playlist/Artists/Min-playlist.json"
	},
	{
		"name" : "Mr Siro",
		"link" : "file : Playlist/Artists/MrSiro-playlist.json"
	},
	{
		"name" : "Noo Phuoc Thinh",
		"link" : "file : Playlist/Artists/NooPhuocThinh-playlist.json"
	},
	{
		"name" : "Only C",
		"link" : "file : Playlist/Artists/OnlyC-playlist.json"
	},
	{
		"name" : "Phan Manh Quynh",
		"link" : "file : Playlist/Artists/PhanManhQuynh-playlist.json"
	},
	{
		"name" : "Son Tung MTP",
		"link" : "file : Playlist/Artists/SonTung-playlist.json"
	},
	{
		"name" : "Soobin Hoang Son",
		"link" : "file : Playlist/Artists/SoobinHoangSon-playlist.json"
	},
	{
		"name" : "Tien Tien",
		"link" : "file : Playlist/Artists/TienTien-playlist.json"
	},
	{
		"name" : "Trinh Dinh Quang",
		"link" : "file : Playlist/Artists/TrinhDinhQuang-playlist.json"
	},
	{
		"name" : "Trinh Thang Binh",
		"link" : "file : Playlist/Artists/TrinhThangBinh-playlist.json"
	},
	{
		"name" : "Trung Quan Idol",
		"link" : "file : Playlist/Artists/TrungQuanIdol-playlist.json"
	},
	{
		"name" : "======= Korean singer =======",
		"link" : ""
	},
	{
		"name" : "Big Bang",
		"link" : "file : Playlist/Artists/BigBang-playlist.json"
	},
	{
		"name" : "BTS",
		"link" : "file : Playlist/Artists/BTS-playlist.json"
	},
	{
		"name" : "EXO",
		"link" : "file : Playlist/Artists/EXO-playlist.json"
	},
	{
		"name" : "G-Dragon",
		"link" : "file : Playlist/Artists/G-Dragon-playlist.json"
	},
	{
		"name" : "PSY",
		"link" : "file : Playlist/Artists/PSY-playlist.json"
	},
	{
		"name" : "SNSD",
		"link" : "file : Playlist/Artists/SNSD-playlist.json"
	},
	{
		"name" : "T-ARA",
		"link" : "file : Playlist/Artists/T-ARA-playlist.json"
	},
	{
		"name" : "TWICE",
		"link" : "file : Playlist/Artists/TWICE-playlist.json"
	},
	{
		"name" : "========= US singer =========",
		"link" : ""
	},
	{
		"name" : "Alan Walker",
		"link" : "file : Playlist/Artists/AlanWalker-playlist.json"
	},
	{
		"name" : "Charlie Puth",
		"link" : "file : Playlist/Artists/CharliePuth-playlist.json"
	},
	{
		"name" : "Justin Bieber",
		"link" : "file : Playlist/Artists/JustinBieber-playlist.json"
	},
	{
		"name" : "Maroon 5",
		"link" : "file : Playlist/Artists/Maroon5-playlist.json"
	},
	{
		"name" : "Taylor Swift",
		"link" : "file : Playlist/Artists/TaylorSwift-playlist.json"
	}
];

//=============    Music List   ==============
var SongList = [];

//=============  Background   ==================
var BackList = [
	{
		"name" :  "Alienship",
		"link" :  "image/Alienship.jpg"	
	},
	{
		"name" :  "Animemountain",
		"link" :  "image/Animemountain.jpg"
	},
	{
		"name" :  "Animeworld",
		"link" :  "image/Animeworld.jpg"
	},
	{
		"name" :  "Beachbeauty",
		"link" :  "image/Beachbeauty.jpg"
	},
	{
		"name" :  "Beachsunset",
		"link" :  "image/Beachsunset.jpg"
	},
	{
		"name" :  "Bigbuilt",
		"link" :  "image/Bigbuilt.jpg"	
	},
	{
		"name" :  "Bigwall",
		"link" :  "image/Bigwall.jpg"	
	},
	{
		"name" :  "Blue",
		"link" :  "image/Blue.jpg"	
	},
	{
		"name" :  "Blueearth",
		"link" :  "image/Blueearth.jpg"	
	},
	{
		"name" :  "Bridge",
		"link" :  "image/Bridge.jpg"	
	},
	{
		"name" :  "Chain",
		"link" :  "image/Chain.jpg"	
	},
	{
		"name" :  "ChayNgayDi",
		"link" :  "image/ChayNgayDi.jpg"	
	},
	{
		"name" :  "Chickenland",
		"link" :  "image/Chickenland.jpg"	
	},
	{
		"name" :  "Circle",
		"link" :  "image/Circle.jpg"	
	},
	{
		"name" :  "CircleEarth",
		"link" :  "image/CircleEarth.jpg"	
	},
	{
		"name" :  "Citysunset",
		"link" :  "image/Citysunset.jpg"	
	},
	{
		"name" :  "Cloud",
		"link" :  "image/Cloud.jpg"	
	},
	{
		"name" :  "Darksnow",
		"link" :  "image/Darksnow.jpg"	
	},
	{
		"name" :  "Darkfuture",
		"link" :  "image/Darkfuture.jpg"	
	},
	{
		"name" :  "Darksky",
		"link" :  "image/Darksky.jpg"	
	},
	{
		"name" :  "Dragonworld",
		"link" :  "image/Dragonworld.jpg"	
	},
	{
		"name" :  "Dreamland",
		"link" :  "image/Dreamland.jpg"	
	},
	{
		"name" :  "Earth2",
		"link" :  "image/Earth2.jpg"	
	},
	{
		"name" :  "Fast",
		"link" :  "image/Fast.jpg"	
	},
	{
		"name" :  "Flatcity",
		"link" :  "image/Flatcity.jpg"	
	},
	{
		"name" :  "Freedom",
		"link" :  "image/Freedom.jpg"	
	},
	{
		"name" :  "Futureplace",
		"link" :  "image/Futureplace.jpg"	
	},
	{
		"name" :  "Ice",
		"link" :  "image/Ice.jpg"	
	},
	{
		"name" :  "Lost",
		"link" :  "image/Lost.jpg"	
	},
	{
		"name" :  "Mapearth",
		"link" :  "image/Mapearth.jpg"	
	},
	{
		"name" :  "Mar",
		"link" :  "image/Mar.jpg"	
	},
	{
		"name" :  "Midnight",
		"link" :  "image/Midnight.jpg"	
	},
	{
		"name" :  "MilkyWay",
		"link" :  "image/MilkyWay.jpg"	
	},
	{
		"name" :  "Mountain",
		"link" :   "image/Mountain.jpg"
	},
	{
		"name" :  "Mysteriousworld",
		"link" :  "image/Mysteriousworld.jpg"	
	},
	{
		"name" :  "Nebulastar",
		"link" :  "image/Nebulastar.jpg"	
	},
	{
		"name" :  "Nightfuture",
		"link" :  "image/Nightfuture.jpg"	
	},
	{
		"name" :  "NightTreesStars(HD)",
		"link" :  "image/NightTreesStars(HD).jpg"
	},
	{
		"name" :  "Peaceful",
		"link" :  "image/Peaceful.jpg"	
	},
	{
		"name" :  "Plantcity",
		"link" :  "image/Plantcity.jpg"	
	},
	{
		"name" :  "Redcity",
		"link" :  "image/Redcity.jpg"	
	},
	{
		"name" :  "River",
		"link" :  "image/River.jpg"	
	},
	{
		"name" :  "Robot",
		"link" :  "image/Robot.jpg"	
	},
	{
		"name" :  "Sandcave",
		"link" :  "image/Sandcave.jpg"	
	},
	{
		"name" :  "Saturn",
		"link" :  "image/Saturn.jpg"	
	},
	{
		"name" :  "Seablue",
		"link" :  "image/Seablue.jpg"	
	},
	{
		"name" :  "Seanight",
		"link" :  "image/Seanight.jpg"	
	},
	{
		"name" :  "Secretplanet",
		"link" :  "image/Secretplanet.jpg"
	},
	{
		"name" :  "Simple",
		"link" :  "image/Simple.jpg"	
	},
	{
		"name" :  "Sky3D",
		"link" :  "image/Sky3D.jpg"	
	},
	{
		"name" :  "Skyhouse",
		"link" :  "image/Skyhouse.jpg"	
	},
	{
		"name" :  "Skyroad",
		"link" :  "image/Skyroad.jpg"	
	},
	{
		"name" :  "Spaceship",
		"link" :  "image/Spaceship.jpg"	
	},
	{
		"name" :  "Starred",
		"link" :  "image/Starred.jpg"	
	},
	{
		"name" :  "Strangeplace",
		"link" :  "image/Strangeplace.jpg"	
	},
	{
		"name" :  "Technology",
		"link" :  "image/Technology.jpg"	
	},
	{
		"name" :  "Tinyplace",
		"link" :  "image/Tinyplace.jpg"	
	},
	{
		"name" :  "Treeworld",
		"link" :  "image/Treeworld.jpg"
	},
	{
		"name" :  "Tron",
		"link" :  "image/Tron.jpg"	
	},
	{
		"name" :  "Underground",
		"link" :  "image/Underground.jpg"	
	},
	{
		"name" :  "Violet",
		"link" :  "image/Violet.jpg"	
	},
	{
		"name" :  "War",
		"link" :  "image/War.jpg"	
	},
	{
		"name" :  "Wind",
		"link" :  "image/Wind.jpg"	
	},
	{
		"name" :  "Work",
		"link" :  "image/Work.jpg"	
	}
];
