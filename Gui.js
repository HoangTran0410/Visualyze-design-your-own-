var VisualizeGui = {
	// music setting
		loop: false,
		volume : 1,
		backgs : "",
		songs : "",
		autoChangeBack : false,

	// visualize folder
		showDesignMode: false,
		ampType : "lineGraph",
		add_amp : function(){
			var type = VisualizeGui.ampType;
			objects.push(new AmplitudeGraph(random(width), random(height), 100, 100, type));
		},

		fftType : "center",
		add_fft : function(){
			var type = VisualizeGui.fftType;
			objects.push(new fftGraph(random(width), random(height), 200, 100, type));
		},

	// buttons folder
		add_playBut : function(){
			objects.push(new ButtonShape(random(width), random(height), 
				120, 60, "Play", function(){animationAvatar();},  function(){playPause();}));
		},
		add_nextBut: function(){
			objects.push(new ButtonShape(random(width), random(height), 
				70, 50, "Next", null, function(){nextPre('next');}));
		},
		add_preBut : function(){
			objects.push(new ButtonShape(random(width), random(height), 
				70, 50, "Pre", null, function(){nextPre('pre');}));
		},

	// title
		titleColor: "#ffae23",
		add_titleSong : function(){
			objects.push(new textBox(width/2, 100, 100, 25, info.title, 'title'));
		},
		add_time : function(){
			objects.push(new textBox(width/2, height/2, 100, 20, null, 'time'));
		},

	// text
		textValue : "write your text here",
		textColor: "#ffae23",
		add_text : function(){
			objects.push(new textBox(100, height-100, 100, 25, VisualizeGui.textValue, 'text'));	
		},

		// save theme
		savetheme : function(){
			saveTheme();
		},

	// help
		help : function(){
			help();
		},

	// github
		github : function(){
			window.open('https://github.com/HoangTran0410/Visualyze-design-your-own-'); 
		},

	// old version
		old : function(){
			window.open('https://hoangtran0410.github.io/VisualyzeTest/');
		}
};

function addGui(){
	var gui = new dat.GUI();

	var audioSetting = gui.addFolder('Audio');
		audioSetting.add(VisualizeGui, 'loop').name('Loop song');
		audioSetting.add(VisualizeGui, 'volume', 0, 1).step(0.01).name('Volume')
			.onChange(function(value){myAudio.elt.volume = value;});
		audioSetting.add(VisualizeGui, 'songs', 
			[	'Attension','Buon Cua Anh','Co Em Cho','Co gai 1m52','Cung Anh','Di Ve Dau',
				'Dieu Anh Biet','Faded','Friends','Ghen','How Long','Tuy Am','Khi Nguoi Minh Yeu Khoc',
				'Khi Phai Quen Di','Phia Sau Mot Co Gai','Shape Of You','Yeu','Lac Troi','Yeu 5',
				'Noi Nay Co Anh','We Dont Talk Anymore','Thanh Xuan','Nguoi Am Phu','Quan Trong La Than Thai',
				'Until You','Yeu Thuong Ngay Do'
			]).name('List music').onChange(function(value){playMusicFromName(value)}).listen();
		audioSetting.add(VisualizeGui, 'backgs',
			{Mountain:0,Beachsunset:1,Seanight:2,Sky3D:3,Mysteriousworld:4,
			 Animemountain:5,Citysunset:6,Treeworld:7,Secretplanet:8,Starred:9,
			 Spaceship:10,Sandcave:11,Redcity:12,Chain:13,Simple:14,Animeworld:15,
			 Bigwall:16,Technology:17,Alienship:18,River:19,Circle:20,
			 strangeplace:21,Nightfuture:22,Dragonworld:23,Mar:24,MilkyWay:25,
			 Work:26,Blue:27,Flatcity:28,Skyroad:29,Violet:30,Cloud:31,
			 Tinyplace:32,Futureplace:33,Bridge:34,Circleearth:35,Fast:36,
			 Nebulastar:37,Tron:38,War:39,Dreamland:40,Seablue:41,Chickenland:42,
			 Skyhouse:43,Underground:44,Freedom:45,Earth2:46,Robot:47
			}).name('Background').onChange(function(value){backG = loadImage("image/BackG"+value+".jpg");console.log('change');}).listen();
		audioSetting.add(VisualizeGui, 'autoChangeBack').name('autoChangeback')
			.onChange(
				function(value){
					if(value) 
						autoChangeBackStep = prompt("Please enter step (in seconds):", "10");
					else autoChangeBackStep = 0;
				});

	var theme = gui.addFolder("Design")
		theme.add(VisualizeGui, 'showDesignMode').name('Design mode').listen()
			.onChange(function(value){designMode = value;});
		var ampFolder = theme.addFolder('Amplitude');
			ampFolder.add(VisualizeGui, 'ampType', ["lineGraph","circle", "singleRect", "singleRect_Ngang"]);
			ampFolder.add(VisualizeGui, 'add_amp').name('add Amp');
		var fftFolder = theme.addFolder('FFT');
			fftFolder.add(VisualizeGui, 'fftType', ["center", "bottom"]);
			fftFolder.add(VisualizeGui, 'add_fft').name('add FFT');
		var buts = theme.addFolder('Buttons');
			buts.add(VisualizeGui, 'add_playBut').name('Play button');
			buts.add(VisualizeGui, 'add_nextBut').name('Next button');
			buts.add(VisualizeGui, 'add_preBut').name('Pre button');
		var title = theme.addFolder('Title');
			title.addColor(VisualizeGui, 'titleColor').name('title Color').listen();
			title.add(VisualizeGui, 'add_titleSong').name('add Title');
			title.add(VisualizeGui, 'add_time').name('add Time');
		var textbox = theme.addFolder('Text Box');
			textbox.add(VisualizeGui, 'textValue').name('your Text');
			textbox.addColor(VisualizeGui, 'textColor').name('textbox Color').listen();
			textbox.add(VisualizeGui, 'add_text').name('add Text');
		theme.add(VisualizeGui, 'savetheme').name('Save Theme');

	var about = gui.addFolder('About');
		about.add(VisualizeGui, 'github').name('My github');
		about.add(VisualizeGui, 'old').name('Old Version');
		
	gui.add(VisualizeGui, 'help').name('Help');
}

function playMusicFromName(name){
	for(var i = 0; i < IdZing.length; i++){
		if(name == IdZing[i].name){
			addAudioFromID(IdZing[i].id);
			break;
		}
	}
}

