var GridTile  =  Class.extend({
	init:function(i,j,position,gridList, context){
		this.container = new PIXI.DisplayObjectContainer();
		this.id = {i:i,j:j};
		this.context = context;
		//this.backGrid = new SimpleSprite("assets/img/hexa.png");
		this.backGrid = new SimpleSprite("assets/img/card.png");
		var tempText = new PIXI.Text(i+","+j, {});
		this.backGrid.setPosition(-this.backGrid.container.texture.width/2,-this.backGrid.container.height/2);
		this.container.addChild(this.backGrid.getContent());
		//this.container.addChild(tempText);
		tempText.position.x = -tempText.width / 2;
		tempText.position.y = -tempText.height / 2;
		this.container.position = position;
		this.width = this.backGrid.container.texture.width;
		this.height = this.backGrid.container.texture.height;
		this.container.setInteractive(true);
		var that = this;
		this.gridList = gridList;	

		this.container.mousedown = this.container.touchstart = function(data){
			that.isdown = false;
			that.context.clickOnGrid(that);
		}
	},
	setBlock:function(){
		this.container.removeChild(this.backGrid.getContent());
		this.backGrid = new SimpleSprite("assets/img/cardBlock.png");
		this.block = true;
		this.container.setInteractive(false);

		this.container.addChild(this.backGrid.getContent());
		this.backGrid.setPosition(-this.backGrid.container.texture.width/2,-this.backGrid.container.height/2);
	},
	getTileById:function(i,j){
		for (var k = 0; k < this.gridList.length; k++) {			
			if(this.gridList[k]!= undefined && this.gridList[k].id.i == i && this.gridList[k].id.j == j && this.gridList[k].getContent != undefined){
				return this.gridList[k];
			}
		};
		return null
	},
	getContent:function () {
		return this.container;
	},
	destroy:function()
	{
		delete this.container;
	}
});