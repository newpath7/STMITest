class ExperimentTrial {
    constructor(s, targtyp) {
	this.correct = false;
	this.certain = 0;
	this.iscritical = false;
	this.phaserscene = s;
	this.targtyp = targtyp;
	this.setMemDisplay();
	this.setInfDisplay();
	this.setResponseDisplay();
	this.trialtyp = Phaser.Math.RND.between(1, 3);
	/* 1 = shorti, 2 = short, 3 = long */
	[this.pausea, this.pauseb, this.pausec,
	 this.paused, this.pausee] = TRIAL_TYPE_PAUSES[this.trialtyp - 1];
    }

    setResponseDisplay() {
	let tmpcp = this.uletters.map((x) => x);
	this.nonmemletters = tmpcp.filter(i => i != this.targetl).slice(0, 3);
	tmpcp = this.letters.map((x) => x);
	this.memletters = Phaser.Utils.Array.Shuffle(tmpcp.filter(i => i != this.targetl)).slice(0, 2);
	var randn = Phaser.Math.RND.between(1, 100);
	
	if (this.targtyp == "real") {
	    if (randn > 84) {
		this.iscritical = true;
	    }
	} else {
	    if (randn > 50) {
		this.iscritical = true;
	    }
	}
    }
    
    setInfDisplay() {
	var rls = Phaser.Utils.Array.Shuffle(LETTERS);
	
	if (this.memtype == "5l1pl") {
		this.iletters = rls.slice(0, 5);
		this.ipletters = rls.slice(5);
		this.iuletters = rls.slice(6, rls.length);
	} else if (this.memtype == "5l2pl") {
		this.iletters = rls.slice(0, 5);
		this.ipletters = rls.slice(5, 7);
		this.iuletters = rls.slice(7, rls.length);
	} else if (this.memtype == "6l2pl") {
	    this.iletters = rls.slice(0, 6);
	    this.ipletters = rls.slice(6, 8);
	    this.iuletters = rls.slice(8, rls.length);
	}
    }
    
    setMemDisplay() {
	/*
	 * 5l + either 1 pl (50% prob) or 2pl (50% prob) - 50%
	 * 6l + 2 pl- 50%
	 * indiciate target letter, 75% probab take real letter
	 * Indicate all letters, indicate non chosen (real) letters 
	 */

	/* 1==5l1pl or 5l2pl, 2==6l2pl */
	var rls = Phaser.Utils.Array.Shuffle(LETTERS);
	
	if (Phaser.Math.RND.between(1, 2) == 1) {
	    if (Phaser.Math.RND.between(1, 2) == 1) {
		this.memtype = "5l1pl";
		this.letters = rls.slice(0, 5);
		this.pletters = rls.slice(5);
		this.uletters = rls.slice(6, rls.length);
	    } else {
		this.memtype = "5l2pl";
		this.letters = rls.slice(0, 5);
		this.pletters = rls.slice(5, 7);
		this.uletters = rls.slice(7, rls.length);
	    }
	}
	else {
	    this.memtype = "6l2pl";
	    this.letters = rls.slice(0, 6);
	    this.pletters = rls.slice(6, 8);
	    this.uletters = rls.slice(8, rls.length);
	}

	if (this.targtyp == "real") {
	    this.targeti = Phaser.Math.RND.between(0, this.letters.length - 1);
	   this.targetl = this.letters[this.targeti];

    } else {
	this.targeti = Phaser.Math.RND.between(0, this.pletters.length - 1);
	this.targetl = this.pletters[this.targeti];
    }
	this.rndsrt = Phaser.Math.RND.between(0, 5);
    }
}
    


export class Experiment extends Phaser.Scene {
	constructor ()
	{
	    super({key: 'Experiment', active: false});
	    this.notstarted = true;
	    this.runningtrial = false;
	    this.sessionn = 0;
	    this.blockn = 0;
	    this.trialn = 0;
	    this.thetrials = [];
	    this.answers = {};
	}

	create()
	{
	    var rln = Math.trunc(0.75 * TRIALS_PER_BLOCK);
	    var pln = TRIALS_PER_BLOCK - rln;
	    document.querySelector('#session').innerHTML = SESSIONS_PER_GAME;
	    document.querySelector('#blockn').innerHTML = BLOCKS_PER_SESSION;
	    document.querySelector('#trialn').innerHTML = TRIALS_PER_BLOCK;
	    
	    for (let sessn = 0; sessn < SESSIONS_PER_GAME; sessn++)
	    {
		this.thetrials[sessn] = [];

		for (let blockn = 0; blockn < BLOCKS_PER_SESSION; blockn++) {
		    this.thetrials[sessn][blockn] = [];

		    for (let trialn = 0; trialn < rln; trialn++) {
			this.thetrials[sessn][blockn].push(new ExperimentTrial(this, "real"));
		    }

		    for (let trialn = 0; trialn < pln; trialn++) {
			this.thetrials[sessn][blockn].push(new ExperimentTrial(this, "pseudo"));
		    }
		    Phaser.Utils.Array.Shuffle(this.thetrials[sessn][blockn]);
		}
	    }
	    this.notstarted = false;
	    this.text = this.add.text(32, 32);

	    /* for response display */
	 
	    var response_container = this.add.container();
            var response_containert = this.add.container();
          var certain_container = this.add.container();
	    response_container.setName("response");
            response_container.setName("responset");
          certain_container.setName("certain");
          var recentert;

            for (let i = RESP_STARTX, j = 1; i <= RESP_ENDX;
		 i += RESP_INCX, j++) {
		let rec = new Phaser.GameObjects.Rectangle(this, i, RESP_STARTY, ppd, ppd).setInteractive({useHandCursor: true});
            rec.setStrokeStyle(2, 0xffffff);
		recentert = rec.getCenter();
		let textobj = new Phaser.GameObjects.Text(this, recentert.x - 15, recentert.y, j, { fontFamily: 'Arial', align: 'center', fontSize: 15, color: '#ffffff' }).setName("certain");
		rec.setData("childo", textobj);
		certain_container.add(textobj);
            certain_container.add(rec);
          }
          certain_container.setVisible(false);

	    for (let i = RESP_STARTX; i < RESP_ENDX; i += RESP_INCX) {
		let rec = new Phaser.GameObjects.Rectangle(this, i,
							   RESP_STARTY, ppd, ppd).setInteractive({useHandCursor: true});
		rec.setStrokeStyle(2, 0xffffff);
		recentert = rec.getCenter();
		let textobj = new Phaser.GameObjects.Text(this, recentert.x - 15, recentert.y, "A", { fontFamily: 'Arial', align: 'center', fontSize: 15, color: '#ffffff' });
		response_containert.add(textobj);
		rec.setData("childo", textobj); 
		response_container.add(rec);
	    }

	    for (let i = RESP_STARTX; i < RESP_ENDX; i += RESP_INCX) {
		let rec = new Phaser.GameObjects.Rectangle(this, i,
				RESP_STARTY + RESP_INCY, ppd, ppd).setInteractive({useHandCursor: true});
		rec.setStrokeStyle(2, 0xffffff);
		recentert = rec.getCenter();
		let textobj = new Phaser.GameObjects.Text(this, recentert.x - 15, recentert.y,"A", { fontFamily: 'Arial', align: 'center', fontSize: 15, color: '#ffffff' });
		response_containert.add(textobj);
		rec.setData("childo", textobj);
		response_container.add(rec);
	    }
	    let rec = new Phaser.GameObjects.Rectangle(this, RESP_NONEX,
				RESP_NONEY, RESP_NONELEN, ppd).setInteractive({useHandCursor: true});
	    rec.setStrokeStyle(2, 0xffffff);
	    rec.setName("nonerecc");
	    let recenter = rec.getCenter();
	    let ntext = new Phaser.GameObjects.Text(this, recenter.x - 30, recenter.y, NOOFTH, { fontFamily: 'Arial', align: 'center', fontSize: 15, color: '#ffffff' });
	    rec.setData("childo", ntext);
	    response_container.add(rec);
            response_container.add(response_containert);
	    response_container.setVisible(false);
	    response_container.add(ntext);
	    this.response_container = response_container;
          this.response_containert = response_containert;
          this.certain_container = certain_container;
          this.input.on('pointerdown', function (pointer, gameObjects) {
              gameObjects.forEach((ochild) => {
		  let child = ochild.getData("childo");

		  if (child.name == "certain") {
		      		  console.log(child.name + " - " + child.text);
                gamestats.ExpResponse[gamestats.ExpResponse.length - 1].certain = parseInt(child.text);
                  this.scene.certain_container.setVisible(false);
		  let er = gamestats.ExpResponse[gamestats.ExpResponse.length - 1];
		      document.querySelector("#etr").style.display = "block";
		      if (er.context.iscritical == true) {
			  document.querySelector("#etr").innerHTML = er.chose == NOOFTH ? "Correct" : "Wrong";
			  gamestats.ExpResponse[gamestats.ExpResponse.length - 1].correct = er.chose == NOOFTH ? true : false;
		      } else {
			  document.querySelector("#etr").innerHTML = er.context.targetl == er.chose ? "Correct" : "Wrong";
			  gamestats.ExpResponse[gamestats.ExpResponse.length - 1].correct = er.chose == er.context.targetl ? true : false;
		      }
		/*      document.querySelector("#etr").innerHTML += ": you chose " + er.chose + " and actual letter was " + er.context.targetl + " (iscritical:" + er.context.iscritical + ", type: " + er.context.targtyp + ", rflip:" + er.context.rflip + ")"; */
		      		  setTimeout(() => { 
		      this.scene.runningtrial = false;
				   }, SEE_TRIAL_RESULT_DELAY);  /* to get mouse out of the way and see result */
                  } else {
		      gamestats.ExpResponse.push({chose: child.text,
						  certain: 100,
						  correct: false,
                                          context: child.getData('context')
                                            });
		    this.scene.response_container.setVisible(false);
                  this.scene.certain_container.setVisible(true);
		  }
            });
          });
 	}
    
    memDisplay(thetrial) {
	var tmpl, osp, ox, oy;
	var pmv = new Phaser.Math.Vector2(0, 0);
	var mem_container = thetrial.phaserscene.add.container();
	mem_container.setName("letters");
	document.querySelector("#etr").style.display = "none";
	
	switch (thetrial.memtype) {
	case "5l1pl":
	    for (let i = 0; i < 5; i++) {	
		pmv.setToPolar((thetrial.rndsrt + i) * Math.PI/3, 4.68 * ppd);
		tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
			pmv.y + centery, thetrial.letters[i],
			{font: LETTER_FONT, fill: '#FFF'});
		mem_container.add(tmpl);
	    }
	    pmv.setToPolar((thetrial.rndsrt + 5) * Math.PI/3, 4.58 * ppd);
	    tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
			pmv.y + centery, thetrial.pletters[0],
			{font: LETTER_FONT, fill: '#FFF'});
	    tmpl.setFlipX(true);
	    mem_container.add(tmpl);
	    break;
	    
	case "5l2pl":
	    for (let i = 0; i < 5; i++) {	
		pmv.setToPolar((thetrial.rndsrt + i) * 2 * Math.PI/7,
			       4.68 * ppd);
		tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
			pmv.y + centery, thetrial.letters[i],
			{font: LETTER_FONT, fill: '#FFF'});
		mem_container.add(tmpl);
	    }
	    pmv.setToPolar((thetrial.rndsrt + 5) * 2 * Math.PI/7, 4.58 * ppd);
	    tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
		pmv.y + centery, thetrial.pletters[0],
		{font: LETTER_FONT, fill: '#FFF'});
	    tmpl.setFlipX(true);
	    mem_container.add(tmpl);
	    pmv.setToPolar((thetrial.rndsrt + 6) * 2 * Math.PI/7, 4.58 * ppd);
	    tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
		pmv.y + centery, thetrial.pletters[1],
		{font: LETTER_FONT, fill: '#FFF'});
	    tmpl.setFlipX(true);
	    mem_container.add(tmpl);
	    osp = mem_container.getAt(Phaser.Math.RND.between(0, 6));
	    ox = osp.x;
	    oy = osp.y;
	    osp.setX(tmpl.x);
	    osp.setY(tmpl.y);
	    tmpl.setX(ox);
	    tmpl.setY(oy);
	    break;
	    
	case "6l2pl":
	    for (let i = 0; i < 6; i++) {	
		pmv.setToPolar((thetrial.rndsrt + i) * Math.PI/4, 4.68 * ppd);
		tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
			pmv.y + centery, thetrial.letters[i],
			{font: LETTER_FONT, fill: '#FFF'});
		mem_container.add(tmpl);
	    }
	    pmv.setToPolar((thetrial.rndsrt + 6) * Math.PI/4, 4.58 * ppd);
	    tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
			pmv.y + centery, thetrial.pletters[0],
			{font: LETTER_FONT, fill: '#FFF'});
	    tmpl.setFlipX(true);
	    mem_container.add(tmpl);
	    pmv.setToPolar((thetrial.rndsrt + 7) * Math.PI/4, 4.58 * ppd);
	    tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
		pmv.y + centery, thetrial.pletters[1],
		{font: LETTER_FONT, fill: '#FFF'});
	    tmpl.setFlipX(true);
	    mem_container.add(tmpl);
	    osp = mem_container.getAt(Phaser.Math.RND.between(0, 7));
	    ox = osp.x;
	    oy = osp.y;
	    osp.setX(tmpl.x);
	    osp.setY(tmpl.y);
	    tmpl.setX(ox);
	    tmpl.setY(oy);
	    break;
	default:
	    break;
	}
	setTimeout(() => { this.blankMemDisplay(thetrial); },
		   TRIAL_TYPE_PAUSES[thetrial.trialtyp - 1][0]);
    }

    blankMemDisplay(thetrial){
	thetrial.phaserscene.children.getChildren().forEach((child) => {
				if (child.type === "Container" && 
				    child.name == "letters") {
					child.setVisible(false);
				}
	});
	setTimeout(() => { this.memProbe(thetrial); },
		   TRIAL_TYPE_PAUSES[thetrial.trialtyp - 1][1]);
    }

    memProbe(thetrial) {
	var probex, probey;
	thetrial.phaserscene.children.getChildren().forEach(function (child) {
	    if (child.type === "Container" && child.name == "letters") {
		child.each((el) => {
		    if (el.text == this.targetl) {
			probex = el.x;
			probey = el.y;
		    }
		}, this);
	    }
	}, thetrial);
	let probrec = new Phaser.Geom.Rectangle(0, 0, ppd, ppd);
	Phaser.Geom.Rectangle.CenterOn(probrec, probex, probey);
	let graphics = this.add.graphics({lineStyle: {width: 5, color: 0xffff00}});
	graphics.strokeRectShape(probrec);
	thetrial.probe = graphics;
	
	if (thetrial.trialtyp == 1) {
	    setTimeout(() => { this.showInterference(thetrial) },
		       TRIAL_TYPE_PAUSES[thetrial.trialtyp - 1][2]);
	} else {
	    setTimeout(() => { this.blankmemProbe(thetrial); },
		       TRIAL_TYPE_PAUSES[thetrial.trialtyp - 1][2]);
	}
    }

    blankmemProbe(thetrial) {
	thetrial.probe.destroy();
	setTimeout(() => { this.showInterference(thetrial); },
		   TRIAL_TYPE_PAUSES[thetrial.trialtyp - 1][3]);
    }
    
    showInterference(thetrial) {
	var tmpl, osp, ox, oy;
	var pmv = new Phaser.Math.Vector2(0, 0);
	var imem_container = thetrial.phaserscene.add.container();
	imem_container.setName("iletters");

	switch (thetrial.memtype) {
	case "5l1pl":
	    for (let i = 0; i < 5; i++) {	
		pmv.setToPolar((thetrial.rndsrt + i) * Math.PI/3, 4.68 * ppd);
		tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
			pmv.y + centery, thetrial.iletters[i],
			{font: LETTER_FONT, fill: '#FFF'});
		imem_container.add(tmpl);
	    }
	    pmv.setToPolar((thetrial.rndsrt + 5) * Math.PI/3, 4.58 * ppd);
	    tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
			pmv.y + centery, thetrial.ipletters[0],
			{font: LETTER_FONT, fill: '#FFF'});
	    tmpl.setFlipX(true);
	    imem_container.add(tmpl);
	    break;
	    
	case "5l2pl":
	    for (let i = 0; i < 5; i++) {	
		pmv.setToPolar((thetrial.rndsrt + i) * 2 * Math.PI/7,
			       4.68 * ppd);
		tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
			pmv.y + centery, thetrial.iletters[i],
			{font: LETTER_FONT, fill: '#FFF'});
		imem_container.add(tmpl);
	    }
	    pmv.setToPolar((thetrial.rndsrt + 5) * 2 * Math.PI/7, 4.58 * ppd);
	    tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
		pmv.y + centery, thetrial.ipletters[0],
		{font: LETTER_FONT, fill: '#FFF'});
	    tmpl.setFlipX(true);
	    imem_container.add(tmpl);
	    pmv.setToPolar((thetrial.rndsrt + 6) * 2 * Math.PI/7, 4.58 * ppd);
	    tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
		pmv.y + centery, thetrial.ipletters[1],
		{font: LETTER_FONT, fill: '#FFF'});
	    tmpl.setFlipX(true);
	    imem_container.add(tmpl);
	    osp = imem_container.getAt(Phaser.Math.RND.between(0, 6));
	    ox = osp.x;
	    oy = osp.y;
	    osp.setX(tmpl.x);
	    osp.setY(tmpl.y);
	    tmpl.setX(ox);
	    tmpl.setY(oy);
	    break;
	    
	case "6l2pl":
	    for (let i = 0; i < 6; i++) {	
		pmv.setToPolar((thetrial.rndsrt + i) * Math.PI/4, 4.68 * ppd);
		tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
			pmv.y + centery, thetrial.iletters[i],
			{font: LETTER_FONT, fill: '#FFF'});
		imem_container.add(tmpl);
	    }
	    pmv.setToPolar((thetrial.rndsrt + 6) * Math.PI/4, 4.58 * ppd);
	    tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
			pmv.y + centery, thetrial.ipletters[0],
			{font: LETTER_FONT, fill: '#FFF'});
	    tmpl.setFlipX(true);
	    imem_container.add(tmpl);
	    pmv.setToPolar((thetrial.rndsrt + 7) * Math.PI/4, 4.58 * ppd);
	    tmpl = thetrial.phaserscene.add.text(pmv.x + centerx,
		pmv.y + centery, thetrial.ipletters[1],
		{font: LETTER_FONT, fill: '#FFF'});
	    tmpl.setFlipX(true);
	    imem_container.add(tmpl);
	    osp = imem_container.getAt(Phaser.Math.RND.between(0, 7));
	    ox = osp.x;
	    oy = osp.y;
	    osp.setX(tmpl.x);
	    osp.setY(tmpl.y);
	    tmpl.setX(ox);
	    tmpl.setY(oy);
	    break;
	default:
	    break;
	}
	setTimeout(() => { this.selectTarget(thetrial); },
		   TRIAL_TYPE_PAUSES[thetrial.trialtyp - 1][4]);	
    }


    selectTarget(thetrial) {
	if (thetrial.probe !== undefined) {
	    thetrial.probe.destroy();
	}
	thetrial.phaserscene.children.getChildren().forEach((child) => {
				if (child.type === "Container" && 
				    child.name == "iletters") {
					child.setVisible(false);
				}
	});
      let respch = thetrial.memletters.concat(thetrial.nonmemletters, [thetrial.targetl]);
	respch = Phaser.Utils.Array.Shuffle(respch);
	// flip if PL and not critical OR if is real letter and critical
	thetrial.rflip = false;
	if (thetrial.targtyp == "real") {
	    if (thetrial.iscritical) {
		thetrial.rflip = true;
	    }
	} else {
	    if (!thetrial.iscritical) {
		thetrial.rflip = true;
	    }
	}
      let dcontext = {targetl: thetrial.targetl, iscritical: thetrial.iscritical,
                      trialtyp: thetrial.trialtyp, targtyp: thetrial.targtyp,
		      rflip: thetrial.rflip};
	this.response_containert.list.forEach((child, i) => {
	    child.resetFlip();
	    if (respch[i] == thetrial.targetl) {
		if (dcontext.rflip == true) {
		    child.setFlipX(true);
		}
	    }
         child.setText(respch[i]);
        child.setData("context", dcontext);
	});
	
	this.response_container.list.forEach((child, i) => {
	    if (child.name == "nonerecc") {
		let tmp = child.getData("childo");
		tmp.setData("context", dcontext);
		child.setData("childo", tmp);
	    }
	});
	this.response_container.setVisible(true);
    }

    preDestroy() {
	let stathtml = '<table><tr><th>chose</th><th>actual answer</th>';
	stathtml += '<th>actual flipped</th>';
	stathtml += '<th>Is critical?</th><th>Your certainty</th><th>C/W</th></tr>';
	gamestats.ExpResponse.forEach((child) => {
	    stathtml += '<tr>';
	    let chose = child.chose;
	    let context = child.context;
	    stathtml += '<td>' + chose + '</td><td>' + context.targetl + '</td>';
	    stathtml += '<td>' + context.rflip + '</td>';
	    stathtml += '<td>' + context.iscritical + '</td>';
	    stathtml += '<td>' + child.certain + '</td>';
	    stathtml += '<td>' + child.correct + '</td>';
	    stathtml += '</tr>';
	});
	stathtml += '</table>';
	document.querySelector("#etr").innerHTML = stathtml;	      
    }
    
    update () {
	if (!this.notstarted && !this.runningtrial) { 
	    if (this.sessionn >= SESSIONS_PER_GAME) {
		this.preDestroy();
		this.sys.game.destroy();
		return;
	    }
	    
	    if (this.trialn < TRIALS_PER_BLOCK && this.blockn < BLOCKS_PER_SESSION && this.sessionn < SESSIONS_PER_GAME) {
		document.querySelector("#triali").innerHTML = this.trialn + 1;
		this.runningtrial = true;
		this.memDisplay(this.thetrials[this.sessionn][this.blockn][this.trialn]);
		this.trialn++;
	    } else {
		if (this.blockn < BLOCKS_PER_SESSION && this.session < SESSIONS_PER_GAME) {
		    this.blockn++;
		    document.querySelector("#blocki").innerHTML = this.blockn + 1;
		    this.trialn = 0;
		} else {
		    if (this.sessionn < SESSIONS_PER_GAME) {
			this.sessionn++;
			document.querySelector("#sessioni").innerHTML = this.sessionn + 1;
			this.blockn = 0;
			this.trialn = 0;
		    }
		    else {
			this.preDestroy();
			this.sys.game.destroy();
			return;
		    }
		}
	    }
	}
    }
}
