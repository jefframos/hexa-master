var CardModel  =  Class.extend({
	init:function(name, att, def, spd, team, arraySides){
		this.name = name;
		this.att = att/10;
		this.def = def/10;
		this.spd = spd;
		this.team = team;
		var tempsides = [topLeft, topRight, left, right, bottomLeft, bottomRight];
		var maxSpdValue = 120;
		var minSpdValue = 40;
		//var tot = tempsides.length - Math.floor((maxSpdValue / (spd + minSpdValue))).;
		var tot = spd / maxSpdValue * tempsides.length;

		if(tot > tempsides.length)
			tot = tempsides.length;
		else if(tot <= 0)
			tot = 1;

		if(arraySides)
			tempsides = arraySides;
		ArrayUtils.shuffle(tempsides);
		this.sides = new Array();

		for (var i = 0; i < tot; i++) {			
			this.sides.push(tempsides[i]);
		};
	}
});