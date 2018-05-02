var VisualizeGui = {
	// music setting
		loop: false,
		volume : 1,
		changeBack : function(){
			backgNow++;
			if(backgNow > 47) backgNow = 0;
			backG = loadImage("image/BackG"+backgNow+".jpg");
		},
		songs : "",


	// visualize folder
		showDesignMode: false,
		ampType : "circle",
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
		audioSetting.add(VisualizeGui, 'changeBack').name('next background');

	var theme = gui.addFolder("Design")
		theme.add(VisualizeGui, 'showDesignMode').name('Design mode').listen()
			.onChange(function(value){designMode = value;});
		var ampFolder = theme.addFolder('Amplitude');
			ampFolder.add(VisualizeGui, 'ampType', ["circle", "singleRect", "singleRect_Ngang"]);
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
