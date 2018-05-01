function BoxContain(object) {
	this.pos = createVector(object.pos.x, object.pos.y);
	this.size = createVector(object.size.x, object.size.y);

	this.choosed = false;
	this.allowChangesize = false;
	this.allowChangepos = false;
	this.allowDelete = false;

	// move multi object need this
	this.chooseMulti = false;
	this.distToCenterChoose = createVector(0, 0); 

	this.object = object;

	// apply this.object position to this boxcontain
	this.applyPosition = function(){
		this.pos = this.object.pos;
	}

	this.setChooseMulti = function(trueOrFalse){
		this.chooseMulti = trueOrFalse;
	}

	// center is mouse Drag while move multi objects
	this.setDistToCenter = function(x, y){
		this.distToCenterChoose = createVector(this.pos.x-x, this.pos.y-y);
	}

	this.deleteObject = function(){
		objects.splice(this.object.id, 1);
		// update Id after delete one object
		for(var i = 0; i < objects.length; i++){
			objects[i].updateID(i);
		}
	}

	this.show = function(){
		this.update();
		noFill();
		
		if(this.chooseMulti){
			strokeWeight(3);
			stroke(color('rgb(255, 0, 0)'));
		}
		else {
			stroke(255);
			strokeWeight(1);		
		}
		rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		// change size shape
		if(this.allowChangesize) fill(50); else noFill();
		rect(this.pos.x+this.size.x/2, this.pos.y+this.size.y/2, 20, 20);
		
		// change position shape
		if(this.allowChangepos) fill(50); else noFill();
		ellipse(this.pos.x, this.pos.y, 20, 20);
		
		// delete object shape
		if(this.allowDelete) fill(color('rgb(255, 0, 0)'));
		else fill(color('rgb(100, 0, 0)'));
		rect(this.pos.x+this.size.x/2-10, this.pos.y-this.size.y/2+10, 20, 20);		

		// show value
		noFill();
		if(this.allowChangesize){
			text(floor(this.size.y), this.pos.x+this.size.x/2, this.pos.y);
			text(floor(this.size.x), this.pos.x, this.pos.y+this.size.y/2);

		} else if(this.allowChangepos){
			text(floor(this.pos.x)+"   "+floor(this.pos.y), this.pos.x, this.pos.y);
		
		}else if(this.allowDelete){
			text("X", this.pos.x+this.size.x/2-10, this.pos.y-this.size.y/2+10);
		}
	}

	this.update = function(){
		if(dist(mouseX, mouseY, this.pos.x+this.size.x/2, this.pos.y+this.size.y/2) < 10){
			this.allowChangesize = true;
		
		} else if(dist(mouseX, mouseY, this.pos.x, this.pos.y) < 10){
			this.allowChangepos = true;

		} else if(dist(mouseX, mouseY, this.pos.x+this.size.x/2-10, this.pos.y-this.size.y/2+10) < 10){
			this.allowDelete = true;

		} else {
			this.allowChangesize = false;
			this.allowChangepos = false;
			this.allowDelete = false;
		}
	}

	this.mouseChoose = function(){
		if(dist(mouseX, mouseY, this.pos.x+this.size.x/2, this.pos.y+this.size.y/2) < 10
		|| dist(mouseX, mouseY, this.pos.x, this.pos.y) < 10){
			this.choosed = true;

			// save position of all choosed objects when choose mutlti objects
			for(var i = 0; i < objects.length; i++){
				if(objects[i].boxcontain.chooseMulti){
					objects[i].boxcontain.setDistToCenter(this.pos.x, this.pos.y);
				}
			}
		
		} else {
			this.choosed = false;
			if(dist(mouseX, mouseY,this.pos.x+this.size.x/2-10, this.pos.y-this.size.y/2+10) < 10)
				this.deleteObject();
		}
	}

	this.drag = function() {
		if(this.choosed){
			if(this.allowChangesize){
				var delx = mouseX-(this.pos.x+this.size.x/2);
				var dely = mouseY-(this.pos.y+this.size.y/2);
				this.pos.add(delx/2, dely/2);
				this.size.add(delx, dely);

				this.object.setPosition(this.pos.x, this.pos.y);
				this.object.setSize(this.size.x, this.size.y);
			
			} else if(this.allowChangepos){
				this.pos = createVector(mouseX, mouseY);
				
				this.object.setPosition(this.pos.x, this.pos.y);
				this.object.setSize(this.size.x, this.size.y);

				// change all pos of object choosed (move multi objects)
				if(this.chooseMulti){
					for(var i = 0; i < objects.length; i++){
						if(objects[i].boxcontain.chooseMulti){
							objects[i].setPosition(this.pos.x+objects[i].boxcontain.distToCenterChoose.x,
													this.pos.y+objects[i].boxcontain.distToCenterChoose.y);
							objects[i].boxcontain.applyPosition();
						}
					}
				}
			}
		}
	}
}