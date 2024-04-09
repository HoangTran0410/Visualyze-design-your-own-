// ======================== Effects ===========================
function playPause() {
	if (myAudio.elt.paused && myAudio.elt.duration > 0) {
		myAudio.elt.play();
		myAudio.autoplay(true);
	}
	else myAudio.elt.pause();
}

function nextPre(nextOrPre) {
	if (VisualizeGui.rand) {
		var step = floor(random(1, SongList.length));
		if (nextOrPre == 'next') indexSongNow = (indexSongNow + step) % SongList.length;
		else indexSongNow -= step;
		if (indexSongNow < 0) indexSongNow = SongList.length - indexSongNow;

	} else {
		if (nextOrPre == 'next') indexSongNow++;
		else indexSongNow--;
	}

	var len = SongList.length;
	if (indexSongNow >= len) indexSongNow -= len;
	if (indexSongNow < 0) indexSongNow += len;

	var link = SongList[indexSongNow].link;
	addAudio(link);
}

function animationAvatar() {
	if (info.avatar) {
		push();
		translate(mouseX + info.avatar.width / 2, mouseY + info.avatar.height / 2);
		if (!myAudio.elt.paused && myAudio.elt.duration > 0)
			rotate(((millis() / 20) % 360));
		image(info.avatar, 0, 0);
		pop();
	}
}

function time(fullDetail) {
	// total time
	var Se = floor(myAudio.elt.duration % 60);
	var Mi = floor((myAudio.elt.duration / 60) % 60);
	var Ho = floor(myAudio.elt.duration / 60 / 60);
	// current time
	var mili = nfc(myAudio.elt.currentTime % 60, 2);
	var s = floor(myAudio.elt.currentTime % 60);
	var m = floor((myAudio.elt.currentTime / 60) % 60);
	var h = floor(myAudio.elt.currentTime / 60 / 60);
	//Add 0 if seconds less than 10
	if (mili < 10) mili = '0' + mili;
	if (Se < 10) Se = '0' + Se;
	if (s < 10) s = '0' + s;

	if (fullDetail)
		return (m + ":" + mili + " / " + Mi + ":" + Se); // for lyric

	if (Ho > 0)
		return (h + ":" + m + ":" + s + " / " + Ho + ":" + Mi + ":" + Se);
	return (m + ":" + s + " / " + Mi + ":" + Se);
}

function animationBackground() {
	if (backG) {
		if (VisualizeGui.animateBack) {
			image(backG, width / 2, height / 2, width + ampLevel * 50, height + ampLevel * 50);
		} else image(backG, width / 2, height / 2, width, height);

	} else background(0);
}

var autoChangeBackStep = 15;
var alreadyChange = true;
var changeRandom = true;

function autoChangeBackFunc() {
	if (autoChangeBackStep != 0 && VisualizeGui.autoChangeBack && BackList.length > 0) {
		if (second() % autoChangeBackStep == 0 && !alreadyChange) {
			if (changeRandom)
				backgNow = (backgNow += floor(random(0, 5))) % BackList.length;
			else backgNow = (backgNow + 1) % BackList.length;
			VisualizeGui.backgs = BackList[backgNow].name;
			loadImage(BackList[backgNow].link, function(data) {
				backG = data;
			});
			alreadyChange = true;

		} else if (second() % autoChangeBackStep != 0) alreadyChange = false;
	}
}

function help() {
	alert(
		`  Visualyze Demo 2 (Design your own Visualyze)
	You can Drag to this web ONE file :
	   + image to change background (be added to list background)
	   + audio (mp3, mp4, ogg, m4a..) to play (be added to list music)
	   + lyric (.lrc) to load lyric
	   + theme (.json) to apply theme
	Key:
	   + S : on / off Design mode (new)
	   + C : on / off controls music
	   + H : on / off dat.GUI controls
	   + Left-Right arrow: jump 5s
	   + Up-Down arrrow : volume
	
	** IN DESIGN MODE:
	   + all objects has it own box contain
	   + click red button           => delete object
	   + drag "square_bottom right" => change size
	   + drag "circle_center"       => change position
	   + CTRL + drag mouse          => choose multi objects
	      => drag "circle_center" of any shape in choosed to move all objects choosed
	`);
	window.open('https://youtu.be/WlWb7VcEK4E?list=PL2HRjs0DtRIExJikFiGRw4gNYSu7tEnAq');
}

function rp(str) { // replace " ' out of string
	return str.replace(/\'|\"/g, " ");
}

function isStringArray(obj) {
	if (obj[0].length > 1) return true;
	return false;
}

//========================== Audio ================================
function createNewAudio(linkMedia) {
	VisualizeGui.linkCurrentSong = linkMedia;
	if (myAudio == null) {
		myAudio = createAudio(linkMedia);
		myAudio.elt.controls = false;
		myAudio.autoplay(false);
		myAudio.onended(function() {
			if (!VisualizeGui.loop) nextPre('next');
			else myAudio.play();
		});
		myAudio.connect(p5.soundOut);

	} else {
		myAudio.src = linkMedia;
	}
}

function isAlreadyHaveSong(link) {
	for (var i = 0; i < SongList.length; i++) {
		if (link == SongList[i].link) {
			return i;
		}
	}
	return -1;
}

function addSCData(idSC, title, user, link) {
	if (isAlreadyHaveSong(link) < 0) {
		var name = title + " - " + user;
		SongList.push({
			"name": name,
			"link": link
		});
		addToDropdown(dropListMusic, name);
		VisualizeGui.titleName = name;
		console.log("soundcloud: " + idSC + "   " + title + "   " + link);
	}
}

function addAudio(linkInput, notPlay) {
	// link local file or link soudcloud music
	if (linkInput.substring(0, 5) == 'blob:' || linkInput.substring(0, 26) == 'https://api.soundcloud.com') {
		if (!notPlay) {
			createNewAudio(linkInput);

			//get avatar from soundcloud
			if (linkInput.substring(0, 34) == 'https://api.soundcloud.com/tracks/') {
				var idtrack = linkInput.substring(linkInput.search("/tracks/") + 8);
				idtrack = idtrack.substring(0, idtrack.search("/stream"));
				loadJSON('https://api.soundcloud.com/tracks/' +
					idtrack + '/?json&client_id=' + client_id,
					function(data) {
						if (data.artwork_url) {
							info.setAva(data.artwork_url);
						}
					});
			}
		}

		var havesong = isAlreadyHaveSong(linkInput);
		if (havesong >= 0) {
			info.setTitle(SongList[havesong].name, false);
			VisualizeGui.titleName = SongList[havesong].name;
			VisualizeGui.songs = rp(SongList[havesong].name);
			indexSongNow = havesong;
		}

		// soucdcloud link get JSON
	} else if (linkInput.substring(0, 6) == 'https:') {
		cursor(WAIT);
		loadJSON('https://api.soundcloud.com/resolve.json?url=' + linkInput +
			'&client_id=' + client_id,
			function(result) {
				console.log(result);
				var numTrack = 1,
					title, user, linkSC;
				var ok = true;

				if (result.kind == "playlist") {
					numTrack = result.tracks.length;
					for (var i = 0; i < numTrack; i++) {
						title = rp(result.tracks[i].title);
						user = result.tracks[i].user.username;
						linkSC = 'https://api.soundcloud.com/tracks/' + result.tracks[i].id +
							'/stream?client_id=' + client_id;
						addSCData(result.tracks[i].id, title, user, linkSC);
					}
					// ========= add to playlist or not =========
					var found = false;
					for (var i = 0; i < PlayList.length; i++) {
						if (linkInput == PlayList[i].link) {
							found = true;
							break;
						}
					}

					if (!found) {
						PlayList.push({
							"name": rp(result.title),
							"link": linkInput
						});
						addToDropdown(dropPlaylists, PlayList[PlayList.length - 1].name);
						VisualizeGui.playlists = rp(result.title);
					}
					// ============ end add to playlist ============

				} else if (result.kind == "track") {
					title = result.title;
					user = result.user.username;
					linkSC = 'https://api.soundcloud.com/tracks/' + result.id +
						'/stream?client_id=' + client_id;
					addSCData(result.id, title, user, linkSC);

				} else {
					ok = false;
					alert("cant load this link\nplease use another link\n" +
						"link of track or playlist must in type:\n" +
						"https://soundcloud.com/ 'user name' / 'track name'\n" +
						"https://soundcloud.com/ 'user name' /sets/ 'playlist name'");
				}

				if (ok && !notPlay) {
					addAudio(SongList[SongList.length - floor(random(1, numTrack))].link);
					if (result.kind == "track" && result.artwork_url) {
						info.setAva(result.artwork_url);
					}
				}
				cursor(ARROW);
			},
			function(e) {
				cursor(ARROW);
				alert("Can not load this song, please try another link\nERROR:" + e);
			}
		);

		// ID zing mp3
	} else {
		loadJSON("https://mp3.zing.vn/xhr/media/get-source?type=audio&key=" + linkInput,
			// loaded
			async function(dataJson) {
				let src = dataJson.data?.source?.[128]
				if (src) {
					let res = await fetch(src)
					dataJson.data.source[128] = res.url;
					console.log(dataJson)
					
					info.updateData(dataJson);
					VisualizeGui.titleName = info.title;
					if (!notPlay)
						createNewAudio(info.medialink);

					var havesong = isAlreadyHaveSong(linkInput);
					if (havesong < 0) {
						addToDropdown(dropListMusic, info.title);
						SongList.push({
							"name": rp(info.title),
							"link": linkInput
						});
						VisualizeGui.songs = rp(info.title);
						indexSongNow = SongList.length - 1;
					} else {
						VisualizeGui.songs = rp(SongList[havesong].name);
						indexSongNow = havesong;
					}
				} else {
					if (myAudio)
						alert("can't load this audio link from zingmp3");
					else {
						alert("can't load audio link from zingmp3, play default song");
						createNewAudio("Theo Anh - Ali Hoang Duong.mp3");
						info.setTitle('Theo Anh - Ali Hoang Duong.mp3', 'file');
					}
				}
			},
			// error
			function(e) {
				if (myAudio)
					alert(e + "\ncan't load this audio link from zingmp3");
				else {
					alert(e + "\ncan't load audio link from zingmp3, play default song");
					createNewAudio("Theo Anh - Ali Hoang Duong.mp3");
					info.setTitle('Theo Anh - Ali Hoang Duong.mp3', 'file');
				}
			}
		);
	}
}

//===================== Dropdown List (DList) ===========================
function addToDropdown(nameDList, object) {
	var countElement = nameDList.__select.childElementCount;
	var str = "<option value='" + rp(object) + "'>" + ((countElement + 1) + ': ' + object) + "</option>";
	nameDList.domElement.children[0].innerHTML += str;
}

function updateDropDown(nameDList, newList) {
	nameDList.domElement.children[0].innerHTML = "";
	for (var i = 0; i < newList.length; i++) {
		addToDropdown(nameDList, newList[i].name);
	}
}

function deleteCurrentObjectInList(nameDList, sourceList, nameWantDelete) {
	for (var i = 0; i < sourceList.length; i++) {
		if (sourceList[i].name == nameWantDelete) {
			sourceList.splice(i, 1);
			break;
		}
	}
	updateDropDown(nameDList, sourceList);
}

function showDropDown(element) {
	var event;
	event = document.createEvent('MouseEvents');
	event.initMouseEvent('mousedown', true, true, window);
	element.dispatchEvent(event);
}

function showFolder(folderName) {
	gui.open();
	if (folderName == 'Design') {
		gui.__folders.Design.closed = false;

	} else {
		gui.__folders.Setting.closed = false;

		if (folderName == 'Audio') {
			gui.__folders.Setting.__folders.Audio.closed = false;
			showDropDown(gui.__folders.Setting.__folders.Audio.__ul.children[2].children[0].children[1].children[0]);

		} else if (folderName == 'Background') {
			gui.__folders.Setting.__folders.Background.closed = false;
			showDropDown(gui.__folders.Setting.__folders.Background.__ul.children[1].children[0].children[1].children[0]);
		}
	}
}

// ====================== Local file , themes ============================
function getFileLocal(filein) {
	if (filein.type === 'image') {
		var url = URL.createObjectURL(filein.file);
		BackList.push({
			"name": filein.file.name,
			"link": url
		});
		backgNow = BackList.length - 1;
		addToDropdown(dropListBackG, rp(filein.file.name));
		VisualizeGui.backgs = filein.file.name;
		loadImage(url, function(data) {
			backG = data;
			showFolder('Background');
		});

	} else if (filein.type === 'audio' || filein.type === 'video') {
		var url = URL.createObjectURL(filein.file);
		var name = rp(filein.file.name);
		showFolder('Audio');
		if (isAlreadyHaveSong(url) < 0) {
			addToDropdown(dropListMusic, name);
			SongList.push({
				"name": name,
				"link": url
			});
		}

	} else {
		var nameFile = filein.file.name;
		var type = nameFile.substring(nameFile.length - 4, nameFile.length);
		if (type == "json") {
			loadJSON(URL.createObjectURL(filein.file),
				// loaded
				function(data) {
					if (nameFile.substring(nameFile.length - 14, nameFile.length) == "-playlist.json") {
						SongList = data.SongList;
						updateDropDown(dropListMusic, SongList);
						addAudio(SongList[floor(random(SongList.length))].link);
						showFolder('Audio');

						PlayList.push({
							"name": data.nameList,
							"link": "file : " + URL.createObjectURL(filein.file)
						});
						updateDropDown(dropPlaylists, PlayList);
						VisualizeGui.playlists = data.nameList;

					} else loadTheme(data, true, true);
				}
			);

		} else if (type == '.lrc') {
			info.getLyric(URL.createObjectURL(filein.file));
		
		} else if(type == '.otf' || type == '.ttf' || type == '.OTF' || type == '.TTF'){
			for(var i = 0; i < objects.length; i++){
				if(objects[i].objectType != "AmplitudeGraph" && objects[i].objectType != "fftGraph")
				if(isPointInsideRect2(v(mouseX, mouseY), objects[i].pos, objects[i].size)){
					loadFont(URL.createObjectURL(filein.file), 
							function(font){objects[i].tf = font},
							function(e){alert(e);});
					break;
				}	
			}

		} else alert('File "' + filein.file.name + '" not support , Please choose another file');
	}
}

function saveTheme(convertToString) {
	var theme = {};
	theme.data = [];
	for (var i = 0; i < objects.length; i++) {
		var o = objects[i];
		theme.data[i] = {};
		theme.data[i].objectType = o.objectType;
		theme.data[i].pos = {
			x: floor(o.pos.x),
			y: floor(o.pos.y)
		};
		theme.data[i].size = {
			x: floor(o.size.x),
			y: floor(o.size.y)
		};
		if (o.objectType == 'text') {
			theme.data[i].textInside = o.textInside;
			theme.data[i].textColor = VisualizeGui.textColor;
		} else if (o.objectType == 'title')
			theme.data[i].titleColor = VisualizeGui.titleColor;
		else if (o.objectType == 'lyric') {
			theme.data[i].lyricColor = VisualizeGui.lyricColor;
			theme.data[i].lyricColor2 = VisualizeGui.lyricColor2;
		} else if (o.objectType == 'ButtonShape')
			theme.data[i].name = o.name;
		else if (o.objectType == 'AmplitudeGraph' || o.objectType == 'fftGraph')
			theme.data[i].type = o.type;
	}

	theme.backgNow = backgNow;
	theme.width = width;
	theme.height = height;
	if (convertToString) {
		theme.songNow = 0;
		theme.playlist = {
			"nameList": prompt('Name your theme: '),
			"SongList": [SongList[indexSongNow]]
		};
		return JSON.stringify(theme);

	} else {
		theme.songNow = indexSongNow;
		var nameFileSave = prompt('Name your theme: ');
		theme.playlist = {
			"nameList": nameFileSave,
			SongList
		};
		saveJSON(theme, nameFileSave + '-theme');
	}
}

function loadTheme(dataJson, applyAudio, applyBackG, jsonFromLink) {
	var objects_temp = objects;
	try {
		objects = [];
		for (var i = 0; i < dataJson.data.length; i++) {
			var d = dataJson.data[i];
			// new pos & size value base on size of window (different user has different window size)
			var pos = createVector(width * (d.pos.x / dataJson.width), height * (d.pos.y / dataJson.height));
			var size = createVector(width * (d.size.x / dataJson.width), height * (d.size.y / dataJson.height));
			if (d.objectType == 'AmplitudeGraph') {
				objects.push(new AmplitudeGraph(pos.x, pos.y, size.x, size.y, d.type));

			} else if (d.objectType == 'fftGraph') {
				objects.push(new fftGraph(pos.x, pos.y, size.x, size.y, d.type));

			} else if (d.objectType == 'ButtonShape') {
				if (d.name == 'Next' || d.name == 'Pre') {
					var whenclick = (d.name == 'Next') ? function() {
						nextPre('next');
					} : function() {
						nextPre('pre');
					}
					objects.push(new ButtonShape(pos.x, pos.y, size.x, size.y, d.name, null, whenclick));
				} else objects.push(new ButtonShape(pos.x, pos.y, size.x, size.y, d.name,
					function() {
						animationAvatar();
					},
					function() {
						playPause();
					}))
			} else if (d.objectType == 'title') {
				objects.push(new textBox(pos.x, pos.y, size.x, size.y, info.title, 'title'));
				VisualizeGui.titleColor = d.titleColor;

			} else if (d.objectType == 'time') {
				objects.push(new textBox(pos.x, pos.y, size.x, size.y, null, 'time'));

			} else if (d.objectType == 'lyric') {
				objects.push(new textBox(pos.x, pos.y, size.x, size.y, null, 'lyric'));
				VisualizeGui.lyricColor = d.lyricColor;
				VisualizeGui.lyricColor2 = d.lyricColor2;

			} else if (d.objectType == 'text') {
				objects.push(new textBox(pos.x, pos.y, size.x, size.y, d.textInside, 'text'));
				VisualizeGui.textColor = d.textColor;
			}
		}

		if (dataJson.playlist) {
			var linkArray = [];
			for (var i = 0; i < dataJson.playlist.SongList.length; i++) {
				linkArray.push(dataJson.playlist.SongList[i].link);
			}
			PlayList.push({
				"name": dataJson.playlist.nameList,
				"link": linkArray
			});
			updateDropDown(dropPlaylists, PlayList);

			if (applyAudio && confirm("Do You Want To Change Audio To This Audio's Theme") || jsonFromLink) {
				SongList = dataJson.playlist.SongList;
				updateDropDown(dropListMusic, SongList);
				VisualizeGui.playlists = dataJson.playlist.nameList;
				addAudio(SongList[floor(random(SongList.length))].link);
				// getPlaylist(PlayList[PlayList.length-1].name);
			}
		}

		if (applyBackG && dataJson.backgNow < BackList.length) {
			backgNow = dataJson.backgNow;
			VisualizeGui.backgs = BackList[backgNow].name;
			loadImage(BackList[backgNow].link, function(data) {
				backG = data;
			});
		}


	} catch (e) {
		objects = objects_temp;
		alert("ERROR:" + e + "\nCan't load data from this json file");
	}
}

// ===================== for GUI ==========================
function applyBackground(nameBackground) {
	for (var i = 0; i < BackList.length; i++) {
		if (nameBackground == BackList[i].name) {
			loadImage(BackList[i].link, function(data) {
				backG = data;
			});
			VisualizeGui.backgs = BackList[i].name;
			backgNow = i;
			break;
		}
	}
}

function playMusicFromName(name) {
	var found = false;
	for (var i = 0; i < SongList.length; i++) {
		if (name == rp(SongList[i].name)) {
			addAudio(SongList[i].link);
			found = true;
			break;
		}
	}
	if (!found && SongList[indexSongNow]) {
		VisualizeGui.songs = rp(SongList[indexSongNow].name);
		alert('can not find data to play this song');
	}
}

function getPlaylist(name, notPlay) {
	VisualizeGui.clearSongs();
	VisualizeGui.playlists = name;
	for (var i = 0; i < PlayList.length; i++) {
		if (name == PlayList[i].name) {
			if (PlayList[i].link.substring(0, 6) == "file :") {
				loadJSON(PlayList[i].link.substring(7),
					function(data) {
						SongList = data.SongList;
						updateDropDown(dropListMusic, SongList);
						// if (!notPlay) {
							var ID = SongList[floor(random(SongList.length))].link;
							addAudio(ID, notPlay);
						// }
					}
				);

			} else {
				addAudio(PlayList[i].link);
			}
			break;
		}
	}
}

//======================= Choose multi objects ======================
// when ctrl + drag mouse => choose multi object
function rectChooseMultiObject() {
	this.beginPoint = createVector(0, 0); // is position of mouse when mouse down
	this.endPoint = createVector(0, 0); // is positioni of mouse when mouse drag
	this.isActive = false;

	this.setActive = function(trueOrFalse) {
		this.isActive = trueOrFalse;
	}

	this.setBegin = function(x, y) {
		this.beginPoint = createVector(x, y);
	}

	this.setEnd = function(x, y) {
		this.endPoint = createVector(x, y);
	}

	this.show = function() {
		stroke(255);
		strokeWeight(1);
		noFill();
		var center = createVector(this.beginPoint.x + this.endPoint.x, this.beginPoint.y + this.endPoint.y).mult(0.5);
		var size = createVector(abs(this.beginPoint.x - this.endPoint.x), abs(this.beginPoint.y - this.endPoint.y));
		rect(center.x, center.y, size.x, size.y);
	}
}

function isPointInsideRect(point, beginPoint, endPoint) {
	return (point.x > min(beginPoint.x, endPoint.x) &&
		point.x < max(beginPoint.x, endPoint.x) &&
		point.y > min(beginPoint.y, endPoint.y) &&
		point.y < max(beginPoint.y, endPoint.y));
}

function max(x, y) {
	if (x > y) return x;
	return y;
}

function min(x, y) {
	if (x < y) return x;
	return y;
}

function isPointInsideRect2(point, center, size) {
	return (point.x > center.x - size.x / 2 &&
		point.x < center.x + size.x / 2 &&
		point.y > center.y - size.y / 2 &&
		point.y < center.y + size.y / 2);
}

function v(x, y) {
	return createVector(x, y);
}

//============== NEW =======================
var smoothrand = (function() {
	var randset = [];

	var flr = 0;
	var ceil = 0;

	return function(i) {
		i = i < 0 ? -i : i;

		flr = i | 0;
		ceil = (i + 1) | 0;

		if (isNullOrUndef(randset[flr])) randset[flr] = Math.random();
		if (isNullOrUndef(randset[ceil])) randset[ceil] = Math.random();

		return lerp(randset[flr], randset[ceil], Math.cos((i - flr) * -1 * Math.PI) * -0.5 + 0.5);
	};
})();

function prettyTime(s) {
	s = s || 0;

	var seconds = (s % 60) | 0;
	var minutes = (s / 60 % 60) | 0;
	var hours = (s / 3600) | 0;

	if (hours) return hours + ':' + ('0' + minutes).substr(-2) + ':' + ('0' + seconds).substr(-2);
	else return minutes + ':' + ('0' + seconds).substr(-2);
}
