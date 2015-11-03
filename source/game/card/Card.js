var Card  =  Class.extend({
	init:function(cardModel, callback, context, isRandom){
		this.container = new PIXI.DisplayObjectContainer();
		this.innerContainer = new PIXI.DisplayObjectContainer();

		this.id = {i:-1,j:-1}	;
		this.backTeam1 = new SimpleSprite("assets/img/backCard.png");
		this.backTeam2 = new SimpleSprite("assets/img/backCard.png");
		// this.backTeam2 = new SimpleSprite("assets/img/backCard2.png");
		this.cardModel = cardModel;
		this.actualTeam = cardModel.team;

		this.isRandom = isRandom;
		
		if(this.isRandom)
		{
			this.actualTeam = 2;
			this.randomSpriteCard = new SimpleSprite("assets/img/cardRandom.png");
		}else
			this.container.setInteractive(true);

		if(cardModel.team == 0)
		{
			this.backSprite = this.backTeam1;
			this.arrowIMG = "assets/img/light2.png";

		}
		else
		{
			this.backSprite = this.backTeam2;
			this.arrowIMG = "assets/img/light.png";
		}


		this.backSelectedSprite = new SimpleSprite("assets/img/cardBackSelected.png");
		this.container.addChild(this.innerContainer);

		this.innerContainer.addChild(this.backSprite.getContent());
		this.innerContainer.addChild(this.backSelectedSprite.getContent());

		this.callback = callback;
		this.cardModel = cardModel;
		// this.cardSprite = new SimpleSprite(cardModel.imgURL);		
		// this.container.addChild(this.cardSprite.getContent());
		// this.cardSprite.setPosition(this.backSprite.container.texture.width/2 - this.cardSprite.container.texture.width/2,
		// 	this.backSprite.container.texture.height/2 - this.cardSprite.container.texture.height/2 - 10);
		this.deselect();
		this.context = context;

		this.width = this.backSprite.container.texture.width;
		this.height = this.backSprite.container.texture.height;
		this.putArrows();
		var that = this;
		this.container.mousedown = this.container.touchstart = function(data){
			that.callback(that);
		}
		
		cardModel.att += cardModel.def;
		cardModel.def = cardModel.att;

		this.attText = new PIXI.Text(cardModel.att, {font:"60px Arimo",fill: this.actualTeam == 0?"#ee4e3e":"#4aafff"});
		// var this.attText = new PIXI.Text(cardModel.att+" / "+cardModel.def, {font:"bold 24px Arial",fill: "#75FAFA"});
		this.innerContainer.addChild(this.attText);
		this.attText.position.x = -this.attText.width / 2 + this.width/2;
		this.attText.position.y = this.height  - this.attText.height - 25;

		if(this.randomSpriteCard)
			this.innerContainer.addChild(this.randomSpriteCard.getContent());
		this.innerContainer.position.x = -this.width/2;
		this.innerContainer.position.y = -this.height/2;
	},
	updateTeam:function(){
		//this.container.removeChild(this.backSprite.getContent());

        if(this.isRandom && this.randomSpriteCard.getContent().parent)
			this.randomSpriteCard.getContent().parent.removeChild(this.randomSpriteCard.getContent());

		if(this.actualTeam == 0)
		{
			this.backSprite = new SimpleSprite("assets/img/backCard.png");
			this.arrowIMG = "assets/img/light2.png";

			this.innerContainer.removeChild(this.attText);

			this.attText = new PIXI.Text(this.cardModel.att, {font:"60px Arimo",fill: "#ee4e3e"});
			// var this.attText = new PIXI.Text(cardModel.att+" / "+cardModel.def, {font:"bold 24px Arial",fill: "#75FAFA"});
			this.attText.position.x = -this.attText.width / 2 + this.width/2;
			this.attText.position.y = this.height  - this.attText.height - 25;
			this.innerContainer.addChild(this.attText);
		}
		else if(this.actualTeam == 1)
		{
			// this.backSprite = new SimpleSprite("assets/img/backCard2.png");
			//this.arrowIMG = "assets/img/light.png";
			this.backSprite = new SimpleSprite("assets/img/backCard.png");
		}

		//this.container.addChildAt(this.backSprite.getContent(),0);
		this.putArrows();
	},
	getOppositeDirection:function(direction){

		if(direction == topLeft){
			return hasDirection(bottomRight,this)
		}else if(direction == topRight){
			return hasDirection(bottomLeft,this)
		}else if(direction == left){
			return hasDirection(right,this)
		}else if(direction == right){
			return hasDirection(left,this)
		}else if(direction == bottomLeft){
			return hasDirection(topRight,this)
		}else if(direction == bottomRight){
			return hasDirection(topLeft,this)
		}
		function hasDirection (testDirection, that) {
			for (var i = that.cardModel.sides.length - 1; i >= 0; i--) {
				if(that.cardModel.sides[i] == testDirection)
					return true;
			}
			return false;
		}
	},
	putArrows:function(){
		// console.log('putArrows', this.cardModel)
		var arrow;
		var arrowW;
		var arrowH;
		if(this.arrowContet)
			this.innerContainer.removeChild(this.arrowContet);
		var correction = 0;
		for (var i = this.cardModel.sides.length - 1; i >= 0; i--) {
			this.arrowContet = new PIXI.DisplayObjectContainer();
			arrow = new SimpleSprite(this.arrowIMG);		
			arrowW = arrow.container.texture.width;
			arrowH = arrow.container.texture.height;
			arrow.container.position.x = -arrowW/2; 
			arrow.container.position.y = -arrowH/2; 
			this.arrowContet.addChild(arrow.getContent());
			if(this.cardModel.sides[i] == topLeft){				
				this.arrowContet.position.x = 0 + this.width / 4 + Math.sin(this.arrowContet.rotation) * correction + 1;
				this.arrowContet.position.y = -7 + this.height * 0.125 +  Math.cos(this.arrowContet.rotation) * correction + 8;
				this.arrowContet.rotation = (60 + 180) * 3.14 / 180;
			}else if(this.cardModel.sides[i] == topRight){
				this.arrowContet.position.x =2+ this.width / 2 + this.width / 4 + Math.sin(this.arrowContet.rotation) * correction-3;
				this.arrowContet.position.y = -3 + this.height * 0.125 +  Math.cos(this.arrowContet.rotation) * correction +4;
				this.arrowContet.rotation = -60 * 3.14 / 180;
			}else if(this.cardModel.sides[i]== left){
				this.arrowContet.position.x =(-6)+correction + 8// + 4;
				this.arrowContet.position.y = this.height /2;
				this.arrowContet.rotation = 180 * 3.14/180;
			}else if(this.cardModel.sides[i] == right){
				this.arrowContet.position.x =6+ this.width - correction  - 8;
				this.arrowContet.position.y = this.height /2;
				// this.arrowContet.rotation = 270 * 3.14/180;
			}else if(this.cardModel.sides[i] == bottomLeft){
				this.arrowContet.position.x = 2+this.width / 4 - Math.sin(this.arrowContet.rotation) * correction - 1;
				this.arrowContet.position.y = 7+this.height - this.height * 0.125 -  Math.cos(this.arrowContet.rotation) * correction - 8;
				this.arrowContet.rotation = -240 * 3.14/180;
			}else if(this.cardModel.sides[i] == bottomRight){
				this.arrowContet.position.x = 6 + this.width / 2 + this.width / 4 - Math.sin(this.arrowContet.rotation) * correction - 7;
				this.arrowContet.position.y = 13 + this.height - this.height * 0.125 -  Math.cos(this.arrowContet.rotation) * correction - 13;
				this.arrowContet.rotation = (240 + 180) * 3.14/180;
			}
			this.innerContainer.addChild(this.arrowContet);

		};
	},
	destroy:function(parent, delay){
		this.parent = parent;
		var that = this;
        TweenLite.to(this.getContent(), 0.2, {alpha:0})

		TweenLite.to(this.getContent().scale, 0.2, {delay:delay,
            x:0,y:0
            , onComplete:function(){
            	if(that.parent)
            		that.parent.removeChild(that.getContent());
            }
        })
	},
	select:function(){
		this.selected = true;
		this.backSprite.getContent().visible = false;
		this.backSelectedSprite.getContent().visible = true;
	},
	deselect:function(onGridCallback){
		this.selected = false;		
		this.backSprite.getContent().visible = true;
		this.backSelectedSprite.getContent().visible = false;
		if(onGridCallback)
			this.callback = onGridCallback;
	},
	getContent:function(){
		return this.container;
	},
	setPosition:function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	}
});