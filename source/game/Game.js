var Game = AbstractApplication.extend({
	init:function(canvasWidth, canvasHeight)
	{
		this._super(canvasWidth, canvasHeight);	
	},
	build:function()
	{
		//cria o loader, aqui deve ser carregado todos os assets, a aplicação deve começar na callback
		// var assetsToLoader = [
		
		// ]; 		
		// this.loader = new PIXI.AssetLoader(assetsToLoader);
		// this.initLoad();

		this.onAssetsLoaded();

		this.stage.setBackgroundColor(0x06161B);
		// this.stage.setBackgroundColor(0x06161B);7862E8
	},
	onProgress:function(){
		this._super();
	},
	onAssetsLoaded:function()
	{
		this._super();

		//cria e adiciona as telas da aplicação
	    // var initScreen = new InitScreen("INITSCREEN");
	    // var gameScreen = new GameScreen("GAMESCREEN");
	    var boardScreen = new BoardScreen("Board");

	    // this.screenManager.addScreen(initScreen);
	    // this.screenManager.addScreen(gameScreen);	
	    this.screenManager.addScreen(boardScreen);	

	    //da um foco para a tela de inicio da aplicação    
	    this.screenManager.change("Board");
	},
});