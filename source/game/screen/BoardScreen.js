var BoardScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
    },
    destroy: function () {
        this._super();
        console.log("É PRA DESTRUIR AQUI")


        this.gridList = new Array();
        this.cardModelList = new Array();
        this.cardsList = new Array();

        delete this.boardContainer
        delete this.myCardsContainer
        delete this.opponendCardsContainer
    },
    build: function () {
        var that = this;
        console.log(boardConfig);
        this.selectedCard = null;
        this.hasLoaded = false;
        this.boardContainer = new PIXI.DisplayObjectContainer();
        this.gridList = new Array();
        this.cardModelList = new Array();
        this.cardsList = new Array();
        this.myCardsContainer = new PIXI.DisplayObjectContainer();
        this.levels;
        this.builderGameInfo = new Array();
        this.hasOpponent = false;
        this.shuffleGridArray = null;
        this.textScore = new PIXI.Text("0", {
            font: "50px Arimo",
            fill: "white"
        });
        this.score = 0;
        this.cardsLoaded = 0;
        this.cardsTotal = 0;
        this.blockClick = false;

        this.textScore.position.x = this.canvasArea.x - this.textScore.width - 20;
        // this.textScore.position.x = 0//this.canvasArea.x- this.textScore.width - 20;
        this.textScore.position.y = 180;
        this.myCardsContainer.position.x = this.canvasArea.x / 2;
        //this.myCardsContainer.position.y = this.canvasArea.y / 2;
        

        // this.opponendCardsContainer = new PIXI.DisplayObjectContainer();
        // this.opponendCardsContainer.position.x = 840;
            this.currentCardID=0;

       
        this.addChild(this.boardContainer);
        this.addChild(this.myCardsContainer);
        //this.addChild(this.opponendCardsContainer);
        this.addChild(this.textScore);
        var that = this;

        //var linkk = $.trim(boardConfig[5].value);

        var jsonLevels = function (response) {
            that.levels = response;
            //console.log(that.levels);
            for (var i = that.levels.levels.length - 1; i >= 0; i--) {
                that.levels.levels[i] = ArrayUtils.shuffle(that.levels.levels[i]);
                // that.levels.levels[i]
            };
            // console.log(response.levels[0]);            
            that.initLoadScreen();
            // for (var i = 0; i < parseInt(boardConfig[3].value); i++) {
            //    // that.loadJSON(Math.floor(Math.random() * 300 + 1), i + 1 == parseInt(boardConfig[3].value), 2);
            // };
        }
		$.getJSON("assets/levels.JSON", jsonLevels);
    },
    putRandonCard:function(){
        this.currentCardID ++;
        if(this.currentCardID >= this.levels.levels[3].length)
            this.currentCardID = 0;
        var tempCard = new Card(this.buildCard(this.levels.levels[3][this.currentCardID],0),this.clickCardCallback, this, 0 ? true : false);
        this.myCardsContainer.addChild(tempCard.getContent());
        tempCard.container.scale = {
            x: 0.5,
            y: 0.5
        }
        // console.log(this.gridList[this.shuffleGridArray[acumRandons]])
        var grid = null
        this.shuffleGridArray = ArrayUtils.shuffle(this.shuffleGridArray);
        for (var i = this.shuffleGridArray.length - 1; i >= 0; i--) {
            grid = this.gridList[this.shuffleGridArray[i]];
            if(this.getCardOnGrid(grid.id.i, grid.id.j) == null)
                break;
        };

        if(grid === null)
            console.log('acaba aqui');
        else
        {
            tempCard.id = grid.id;
            this.cardsList.push(tempCard)

            console.log(tempCard.getContent().parent)
            var posObj = {
                    x:grid.container.position.x - tempCard.getContent().parent.position.x + this.boardContainer.position.x, //- (this.selectedCard.width * this.selectedCard.container.scale.x),
                    y:grid.container.position.y - tempCard.getContent().parent.position.y + this.boardContainer.position.y //- (this.selectedCard.height * this.selectedCard.container.scale.y)            }
                }
            tempCard.setPosition(
                posObj.x, posObj.y
                );
            tempCard.getContent().alpha = 0;
            TweenLite.to(tempCard.getContent(), 0.3, {delay:.1, alpha:1})
            TweenLite.to(tempCard.getContent().scale, 0.3, {delay:.1, ease:Back.easeOut, x:1, y:1})
            console.log("PUT RANDONS", grid.id, tempCard)
        }
    },
    buildNextCard: function () {
        this.currentCardID++;
        if(this.currentCardID >= this.levels.levels[2].length)
            this.currentCardID = 0;
        this.cardModelList.push(this.buildCard(this.levels.levels[2][this.currentCardID],1));
        //this.cardModelList.push(this.buildCard([20,20,120],1));
        if(this.currentCardID > 1)
            this.putRandonCard();
        this.updateCards();
    },
    //carrega pelo json
    buildCard: function (infos, team, infoSideCards) {

        var that = this;
        var tempAtt = 0;
        var tempDef = 0;
        var tempSpd = 0;

        this.cardsLoaded += 1;
        tempAtt = parseInt(infos[0]);
        tempDef = parseInt(infos[1]);
        tempSpd = parseInt(infos[2]);
       
        var sidesArray = null;
        if(infoSideCards){
	        for (var i = infoSideCards.length - 1; i >= 0; i--) {
	        	if(infoSideCards[i].name == response.name)
	        		sidesArray = infoSideCards[i].sides; 
	        };
    	}
        return new CardModel(
            'response.name', tempAtt, tempDef,
            tempSpd,
            team,
            sidesArray)
        
    },    
    //inicia o carregamento dos assets da tela
    initLoadScreen: function () {
        //adiciona os elementos a serem carregados
        var assetsToLoader = [
            "assets/img/card.png",
            "assets/img/cardBlock.png",
            "assets/img/backCard.png",
            "assets/img/backCard2.png",
            "assets/img/cardBackSelected.png",
            "assets/img/arrowAttack.png",
            "assets/img/arrowAttack2.png",
            "assets/img/light.png",
            "assets/img/testeGIF.gif",
            "assets/img/teste.png",
            "assets/img/cardRandom.png",
            "assets/img/hexa.png",
        ];
        // for (var i = this.cardModelList.length - 1; i >= 0; i--) {
        //     assetsToLoader.push(this.cardModelList[i].imgURL);
        // };
        this.loader = new PIXI.AssetLoader(assetsToLoader);
        this.initLoad();

    },
    //inicia a app com tudo já carregado
    onAssetsLoaded: function () {

    	var sendBuild = false;
        this._super();
        var centerPoint = {
            x: -60,
            y: 0
        };

        //cria o board		
        // var isHex = boardConfig[0].value == "hex";
        // var boardDimensions = {
        //     x: parseInt(boardConfig[1].value),
        //     y: parseInt(boardConfig[2].value)
        // };

        var isHex =true;
        var boardDimensions = {
            x: parseInt(4),
            y: parseInt(10)
        };

        // console.log("create board");

        this.boardSize = this.createBoard(isHex, boardDimensions, centerPoint, {
            w: 109,
            h: 124
            // w: 105,
            // h: 120
        });

        if (this.shuffleGridArray == null) {
            this.totRandomBlocks = 0;//Math.floor(Math.random() * 7 + 1);
            this.shuffleGridArray = new Array();
            for (var i = 0; i < this.gridList.length; i++) {
                this.shuffleGridArray.push(i);
            };
            this.shuffleGridArray = ArrayUtils.shuffle(this.shuffleGridArray);
            sendBuild = true;
           
        }
        for (var i = 0; i < this.totRandomBlocks; i++) {
            this.gridList[this.shuffleGridArray[i]].setBlock();
        };


        this.boardContainer.position.x = this.canvasArea.x / 2 - this.boardSize.x / 2;
        this.boardContainer.position.y = this.canvasArea.y / 2 - this.boardSize.y / 2 + 75;

        this.buildNextCard();
        // this.putRandonCard();

        
    },
    updateCards:function(){
        var xAcum = 2;
        var myYacum = 0;
        // console.log('tem ',this.cardModelList.length,'na tela')
        for (var i = 0; i < this.cardModelList.length; i++) {
            //console.log(i);
            var tempCard = new Card(this.cardModelList[i], this.clickCardCallback, this, this.cardModelList[i].team == 2 ? true : false);
            tempCard.id = i;
            this.cardsList.push(tempCard);

            //if (this.cardModelList[i].team == 0) {
                // if(this.selectedCard)
                // console.log('log',this.selectedCard.cardModel);
                tempCard.getContent().scale.x = 2;
                tempCard.getContent().scale.y = 2;

                tempCard.getContent().scale.x = 1;
                tempCard.getContent().scale.y = 1;

            this.myCardsContainer.addChild(tempCard.getContent());
            tempCard.setPosition(0,0);
               
        };
        this.myCardsContainer.position.y =this.myCardsContainer.height;
        this.selectedCard = tempCard;//this.cardsList[this.cardsList.length-1];
        // console.log(this.selectedCard, this.cardsList)

        //this.selectedCard.select();
    },
    clickOnGrid: function (grid) {
        // console.log(this.selectedCard.cardModel,'<========')
        if (!this.blockClick && this.selectedCard && this.getCardOnGrid(grid.id.i, grid.id.j) == null) {
            this.cardModelList.pop();
            this.blockClick = true;


            // this.myCardsContainer.removeChild(this.selectedCard.getContent());

            var posObj = {
                x:grid.container.position.x - this.selectedCard.getContent().parent.position.x + this.boardContainer.position.x, //- (this.selectedCard.width * this.selectedCard.container.scale.x),
                y:grid.container.position.y - this.selectedCard.getContent().parent.position.y + this.boardContainer.position.y //- (this.selectedCard.height * this.selectedCard.container.scale.y)            }
            }
            this.selectedCard.getContent().position.x = posObj.x;
            this.selectedCard.getContent().position.y = posObj.y;

            this.selectedCard.container.scale = {
                x: .5,
                y: .5
            }
            this.selectedCard.id = grid.id;
            // TweenLite.to(this.selectedCard.getContent().position, 0.3, {
            //     x:16+ grid.container.position.x - this.selectedCard.getContent().parent.position.x + this.boardContainer.position.x - (this.selectedCard.width * this.selectedCard.container.scale.x) / 2,
            //     y: 16+grid.container.position.y - this.selectedCard.getContent().parent.position.y + this.boardContainer.position.y - (this.selectedCard.height * this.selectedCard.container.scale.y) / 2
            // })
         
            TweenLite.to(this.selectedCard.getContent().scale, 0.3, {ease:Back.easeOut, x:1, y:1})
            
            var that = this;

            setTimeout(function () {
                that.blockClick = false;
                var neighbors = that.getNeighbors(that.selectedCard);
                var cardNeighbor;
                var atacou = false;
                // console.log(neighbors);

                that.attackList = new Array();
                for (temp in neighbors) {
                    cardNeighbor = that.getCardOnGrid(neighbors[temp].i, neighbors[temp].j);
                    // console.log(cardNeighbor);

                    if (cardNeighbor) {
                        that.attackList.push({
                            card: cardNeighbor,
                            side: temp
                        });
                    }
                };
                if (that.attackList.length == 1) {
                    that.attack(that.selectedCard, that.attackList[0].card, that.attackList[0].side, true);
                    atacou = true;
                } else if (that.attackList.length > 1) {
                    var acumopp = 0;
                    var weakCard = that.attackList.length - 1;

                    for (var i = that.attackList.length - 1; i >= 0; i--) {

                    console.log('attack list',that.attackList[i].card.cardModel.def)

                        var oppositeSide = that.attackList[i].card.getOppositeDirection(that.attackList[i].side);
                        if (oppositeSide){
                            acumopp++;

                            if(that.attackList[weakCard].card.cardModel.def > that.attackList[i].card.cardModel.def)
                                weakCard = i//that.attackList[i].card;
                        }
                    };


                    if (acumopp <= 1) {
                        for (var i = that.attackList.length - 1; i >= 0; i--) {
                            that.attack(that.selectedCard, that.attackList[i].card, that.attackList[i].side, true);
                        };
                        atacou = true;
                    } else {
                        //sei lah se isso funcionará
                        console.log('vai atacar o mais fraco sempre', that.attackList[weakCard].card.cardModel.def)
                        that.attack(that.selectedCard, that.attackList[weakCard].card, that.attackList[weakCard].side, true);
                    }
                } else {
                    // console.log('atacou?')
                    that.selectedCard.actualTeam = 0;
                    that.selectedCard.updateTeam();
                }
                // that.selectedCard.setPosition(
                // 	grid.container.position.x-that.selectedCard.getContent().parent.position.x + that.boardContainer.position.x - (that.selectedCard.width * that.selectedCard.container.scale.x) / 2,
                // 	grid.container.position.y-that.selectedCard.getContent().parent.position.y + that.boardContainer.position.y - (that.selectedCard.height * that.selectedCard.container.scale.y) / 2);
                that.selectedCard.deselect(that.callbackCardOnGrid);
                if (atacou) {
                    //that.selectedCard = null;
                    that.attackList = new Array();
                }
                that.getScore();
                that.buildNextCard();

            }, 300);
            //console.log("o card "+this.selectedCard.cardModel.name+" esta na posicao "+this.selectedCard.id.i+"-"+this.selectedCard.id.j+" do grid");
            
        }
        this.getScore();
    },
    callbackCardOnGrid: function (card) {
        var that = card.context;

        var tempAttackList = new Array();
        var tempFirstCard = null;
        var ableToAttack = false;
        for (var i = that.attackList.length - 1; i >= 0; i--) {
            if (card == that.attackList[i].card) {
                tempFirstCard = that.attackList[i];
                ableToAttack = true;
            } else {
                tempAttackList.push({
                    card: that.attackList[i].card,
                    side: that.attackList[i].side
                });
            }
        };
        if (ableToAttack) {
            that.attackList = new Array();
            if (tempFirstCard)
                that.attackList.push(tempFirstCard)

            for (var i = tempAttackList.length - 1; i >= 0; i--) {
                that.attackList.push(tempAttackList[i]);
            };

            // console.log(that.attackList, tempAttackList)
            for (var i = 0; i < that.attackList.length; i++) {
                that.attack(that.selectedCard, that.attackList[i].card, that.attackList[i].side, true);
            };
        }
        that.getScore();
    },
    /**
	o que está funcionando atualmente:
	ataque simples
	ataque com defesa
	ataque com propagação
	ataque multiplo com cartas sem defesa
	ataque multiplo com ao menos uma carta com defesa
	ataque multiplo com 2 ataques simultaneos

	**/

    attack: function (cardAtt, cardDef, direction, propagation, force) {
        // console.log('atacou essa merda')
        if (cardDef.actualTeam == cardAtt.actualTeam) 
        {
            this.selectedCard.actualTeam = 0;
            this.selectedCard.updateTeam();
        }
        else if (force) //força
        {
            // console.log('recebeu efeito da propagação');
            cardDef.actualTeam = cardAtt.actualTeam;
            cardDef.destroy(this.myCardsContainer, .2);
            //this.myCardsContainer.removeChild(cardDef.getContent());
            for (var i = this.cardsList.length - 1; i >= 0; i--) {
                if(this.cardsList[i] == cardDef)
                    this.cardsList.splice(i,1);
            };
            cardDef.updateTeam();
            this.score += cardDef.cardModel.def * 2;
            this.getScore();
        } else if (cardDef.actualTeam != cardAtt.actualTeam) { //ganhei
            var oppositeSide = cardDef.getOppositeDirection(direction);
            if (cardDef.cardModel.def < cardAtt.cardModel.att || !oppositeSide) {

                this.score += cardDef.cardModel.def;

                cardDef.actualTeam = cardAtt.actualTeam;
                //cardDef.updateTeam();
                // if (!oppositeSide)
                //     console.log("o card " + cardAtt.cardModel.name + " ganhou " + cardDef.cardModel.name);
                // else
                //     console.log("o card " + cardAtt.cardModel.name + " atacou e ganhou de " + cardDef.cardModel.name);
                cardAtt.destroy(this.myCardsContainer, 0);
                cardDef.destroy(this.myCardsContainer, 0);
                // this.myCardsContainer.removeChild(cardAtt.getContent());
                // this.myCardsContainer.removeChild(cardDef.getContent());
                for (var i = this.cardsList.length - 1; i >= 0; i--) {
                    if(this.cardsList[i] == cardAtt)
                        this.cardsList.splice(i,1);
                };
                for (var i = this.cardsList.length - 1; i >= 0; i--) {
                    if(this.cardsList[i] == cardDef)
                        this.cardsList.splice(i,1);
                };
                //console.log(this.cardsList, cardDef.parent);
                if (propagation && oppositeSide) {
                    var neighbors = this.getNeighbors(cardDef);
                    var cardNeighbor;
                    for (temp in neighbors) {
                        cardNeighbor = this.getCardOnGrid(neighbors[temp].i, neighbors[temp].j);
                        if (cardNeighbor && cardNeighbor != cardAtt)
                            this.attack(cardDef, cardNeighbor, temp, false, true);
                    };
                }
            } else // perdi
            {
                if (cardDef.actualTeam == 2) {
                    if (cardAtt.actualTeam == 0) {
                        cardAtt.actualTeam = 1;
                        cardDef.actualTeam = 1;
                    } else if (cardAtt.actualTeam == 1) {
                        cardAtt.actualTeam = 0;
                        cardDef.actualTeam = 0;
                    }

                } else
                    cardAtt.actualTeam = cardDef.actualTeam;
                cardAtt.updateTeam();

                //console.log("o card " + cardAtt.cardModel.name + " perdeu de " + cardDef.cardModel.name);


                var neighbors = this.getNeighbors(cardAtt);
                var cardNeighbor;
                for (temp in neighbors) {
                    cardNeighbor = this.getCardOnGrid(neighbors[temp].i, neighbors[temp].j);
                    if (cardNeighbor)
                        this.attack(cardAtt, cardNeighbor, temp, false, true);
                };
                this.getScore();
            }
        }else{
            this.selectedCard.actualTeam = 0;
            this.selectedCard.updateTeam();
        }

        this.getScore();
    },
    getScore: function () {
        var temp1 = 0;
        var temp2 = 0;
        for (var i = this.cardsList.length - 1; i >= 0; i--) {
            if (this.cardsList[i].id.i >= 0) {
                if (this.cardsList[i].actualTeam == 0)
                    temp1++;
                else if (this.cardsList[i].actualTeam == 1)
                    temp2++;
            }
        };
        // console.log(temp1, temp2);

        this.textScore.parent.removeChild(this.textScore);
        // this.textScore = new PIXI.Text(temp1 + "x" + temp2, {
            font: "50px Arimo",
        //     fill: "white"
        // });
        this.textScore = new PIXI.Text(this.score, {
            // font: "50px Reconstruct",
            fill: "white"
        });
        this.textScore.position.x = this.canvasArea.x - this.textScore.width - 20;
        this.textScore.position.y = 180;
        this.addChild(this.textScore);

        return {
            score1: temp1,
            score2: temp2
        }
    },
    getGrid: function (i, j) {
        for (var k = this.gridList.length - 1; k >= 0; k--) {
            if (this.gridList[k].id.i == i && this.gridList[k].id.j == j)
                return this.gridList[k];
        };
        return null;
    },
    getCardByName: function (name) {
        for (var k = this.cardsList.length - 1; k >= 0; k--) {
            if (this.cardsList[k].cardModel.name == name)
                return this.cardsList[k];
        };
        return null;
    },
    getCardOnGrid: function (i, j) {
        for (var k = this.cardsList.length - 1; k >= 0; k--) {
            if (this.cardsList[k].id.i == i && this.cardsList[k].id.j == j)
                return this.cardsList[k];
        };
        return null;
    },
    getNeighbors: function (card) {

        var returnObject = {};
        for (var i = card.cardModel.sides.length - 1; i >= 0; i--) {
            if (card.cardModel.sides[i] == topLeft) {
                returnObject.topLeft = {
                    i: card.id.i - 1,
                    j: card.id.j - 1
                };
            } else if (card.cardModel.sides[i] == topRight) {
                returnObject.topRight = {
                    i: card.id.i - 1,
                    j: card.id.j + 1
                };
            } else if (card.cardModel.sides[i] == left) {
                returnObject.left = {
                    i: card.id.i,
                    j: card.id.j - 2
                };
            } else if (card.cardModel.sides[i] == right) {
                returnObject.right = {
                    i: card.id.i,
                    j: card.id.j + 2
                };
            } else if (card.cardModel.sides[i] == bottomLeft) {
                returnObject.bottomLeft = {
                    i: card.id.i + 1,
                    j: card.id.j - 1
                };
            } else if (card.cardModel.sides[i] == bottomRight) {
                returnObject.bottomRight = {
                    i: card.id.i + 1,
                    j: card.id.j + 1
                };
            }
        }

        return returnObject
    },
    //callback que seleciona o card
    clickCardCallback: function (card) {
        // var that = this.context;
        // if (that.selectedCard != card && that.selectedCard != null) {
        //     that.selectedCard.deselect();
        // }
        // that.selectedCard = card;
        // that.selectedCard.select();
    },
    createBoard: function (isHex, size, centerPoint, tileSize) {
        var tabsize;
        if (isHex) {
            if (size.x && size.y)
                tabsize = size;
            else {
                var midX = size / 2;
                if (midX % 2 != 0)
                    midX++;
                tabsize = {
                    x: midX,
                    y: size
                };
            }
        } else {
            if (size.x && size.y)
                tabsize = size;
            else
                tabsize = {
                    x: size,
                    y: size
                };
        }

        var pairacum = 0;
        var imparacum = 0;
        var pass1;
        var mid = isHex ? tabsize.x / 2 : tabsize.x;
        var that = this;
        var createTile = function (i, j, position) {
            var tempTile = new GridTile(i, j, position, that.gridList, that);
            // var tempTile = new GridTile("assets/img/teste.png", i, j, position, that.gridList, that);
            return tempTile;
        }
        var baseCorners = function (i, j, mid, tabsize) {
            var acum = 2;
            if (i > mid) {
                if (j < tabsize.x / 2) {
                    if (mid % 2 == 0)
                        acum = 1;
                    else
                        acum = 2;

                    for (var k = mid + acum; k < tabsize.x; k += 2) {
                        if (i - j == k) {
                            return false;
                        }
                    };
                } else {
                    if (j > i) {
                        acum = 2;
                        if (i + j > tabsize.y + tabsize.x / 2) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        var tileOK;
        var tempPosition;
        var tempTile;
        var globalAcum = 0;
        var maxX = 0;
        var maxY = 0;
        var tileW = 0;
        var tileH = 0;
        var tileSize = tileSize;

        for (var i = 0; i <= tabsize.x; i++) {
            for (var j = 0; j <= tabsize.y; j++) {
                pass1 = (j + i >= mid) && (i - j >= -(tabsize.y - mid));
                tileOK = pass1 && baseCorners(i, j, mid, tabsize) || !isHex;
                if (i % 2 == 0) {
                    if (!(j % 2 == 0)) {
                        pairacum = 0;
                        if (tileOK) {
                            tempPosition = {
                                x: centerPoint.x + tileSize.w * imparacum + tileSize.w / 2,
                                y: centerPoint.y + tileSize.h * 0.75 * i
                            };
                        }
                        imparacum++;

                    }
                } else {
                    if (j % 2 == 0) {
                        imparacum = 0;
                        if (tileOK) {
                            tempPosition = {
                                x: centerPoint.x + tileSize.w * pairacum,
                                y: centerPoint.y + tileSize.h * 0.75 * i
                            };
                        }

                        pairacum++;
                    }
                }
                //if(tempTile != undefined){
                if (tempPosition) {

                    tempTile = createTile(i, j, tempPosition);
                    this.gridList.push(tempTile);
                    this.boardContainer.addChild(tempTile.getContent());

                    if (tileW <= 0)
                        tileW = tempTile.width;
                    if (tileH <= 0)
                        tileH = tempTile.height;

                    if (maxX < tempPosition.x)
                        maxX = tempPosition.x;
                    if (maxY < tempPosition.y)
                        maxY = tempPosition.y;

                    tempTile.getContent().scale.x = 0.0;
                    tempTile.getContent().scale.y = 0.0;
                    TweenLite.to(tempTile.getContent(), .5, {
                        delay: globalAcum * 0.01,
                        alpha: 1
                    });
                    TweenLite.to(tempTile.getContent().scale, .5, {
                        delay: globalAcum * 0.01,
                        x: 1,
                        y: 1,
                        ease: Back.easeOut
                    });
                    tempTile = undefined;
                    tempPosition = null;
                    globalAcum++;
                }

            };
        };
        return {
            x: maxX,
            y: maxY
        }
    }

});