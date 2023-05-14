class ExperimentTrial {
    constructor(s, targtyp) {
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
	this.nonmemletters = this.uletters.slice(0, 3);
	let tmpcp = this.letters.map((x) => x);
	this.memletters = Phaser.Utils.Array.Shuffle(tmpcp.filter(i => i != this.targeti)).slice(0, 2);
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
	    super({key: 'Experiment', active: true});
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
	    response_container.setName("response");

	    for (let i = 200; i < 500; i += 100) {
		let rec = new Phaser.GameObjects.Rectangle(this, i,
							   300, ppd, ppd);
		rec.setStrokeStyle(2, 0xffffff);
		response_container.add(rec);
	    }

	    for (let i = 200; i < 500; i += 100) {
		let rec = new Phaser.GameObjects.Rectangle(this, i,
							   400, ppd, ppd);
		rec.setStrokeStyle(2, 0xffffff);
		response_container.add(rec);
	    }
	    let rec = new Phaser.GameObjects.Rectangle(this, 300, 500,
						       200, ppd);
	    rec.setStrokeStyle(2, 0xffffff);
	    let recenter = rec.getCenter();
	    response_container.add(rec);
	    response_container.setVisible(false);
	    let ntext = new Phaser.GameObjects.Text(this, recenter.x - 30, recenter.y,
						    "None of These", { fontFamily: 'Arial', align: 'center', fontSize: 15, color: '#ffffff' });
	    response_container.add(ntext);
	    this.response_container = response_container;
 	}
    
    memDisplay(thetrial) {
	var tmpl, osp, ox, oy;
	var pmv = new Phaser.Math.Vector2(0, 0);
	var mem_container = thetrial.phaserscene.add.container();
	mem_container.setName("letters");

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
	console.log("memprobe for " + thetrial.trialtyp);
	
	if (thetrial.trialtyp == 1) {
	    console.log("show interference");
	    setTimeout(() => { this.showInterference(thetrial) },
		       TRIAL_TYPE_PAUSES[thetrial.trialtyp - 1][2]);
	} else {
	    setTimeout(() => { this.blankmemProbe(thetrial); },
		       TRIAL_TYPE_PAUSES[thetrial.trialtyp - 1][2]);
	}
    }

    blankmemProbe(thetrial) {
	console.log("blank memProbe");
	thetrial.probe.destroy();
	setTimeout(() => { this.showInterference(thetrial); },
		   TRIAL_TYPE_PAUSES[thetrial.trialtyp - 1][3]);
    }
    
    showInterference(thetrial) {
	console.log("showing interference");
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
	console.log("select a target");
	console.log(thetrial.memletters + ', ' + thetrial.nonmemletters + ', ' + thetrial.targetl + ', iscritical = ' + thetrial.iscritical);
	this.response_container.setVisible(true);
    }
    
    update () {
	if (!this.notstarted && !this.runningtrial) { 
	    if (this.trialn < TRIALS_PER_BLOCK) {
		this.trialn++;
		this.runningtrial = true;
		this.memDisplay(this.thetrials[this.sessionn][this.blockn][this.trialn]);
	    } else {
		if (this.blockn < BLOCKS_PER_SESSION) {
		    this.blockn++;
		    this.trialn = 0;
		} else {
		    if (this.sessionn < SESSIONS_PER_GAME) {
			this.sessionn++;
			this.blockn = 0;
			this.trialn = 0;
		    }
		}
	    }
	}
    }
}
