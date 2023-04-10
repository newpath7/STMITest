/*
 *  The Seeing Ɔ, remembering C article specifies rectangle size in degrees.
 *  This can be converted to pixel units by
 *  y = pixels per degree; r = distance from display in inches; x = display PPI
 *  y = r*tan(pi/180)/x
 *  See https://www.mathworks.com/matlabcentral/answers/13191-what-does-the-term-display-visual-resolution-in-pixels-degree-means 
 *
 */
var dply_dst = 30;  // we are this much inches from display
var dply_diag = 15.5;	// display diagonal in inches
//var dply_wpx = window.innerWidth * window.devicePixelRatio;
var dply_wpx = window.innerWidth;
//var dply_hpx = window.innerHeight * window.devicePixelRatio;
var dply_hpx = window.innerHeight;
var ppi = Math.sqrt((dply_wpx * dply_wpx) + (dply_hpx * dply_hpx)) / dply_diag;
var ppd = dply_dst * (Math.PI/180)/ (1/ppi);  // pixels per degree
var canvwidth = 800;
var centerx = canvwidth / 2;
var canvheight = 600;
var centery = canvheight / 2;

const RECT_VERT = 1;
const RECT_HORZ = 2;
const RECT_OBLI = 3;

/* time intervals in ms */
const MD_TI = 250;	// memory display time interval
const MDCUE_TI_MIN = 100;		// min memory display to cue
const MDCUE_TI_MAX = 1000;	// max memory display to cue


class TrainTrial {
	constructor() {
		var pmv;
		/* rect params */
		this.rec_ori = Phaser.Utils.Array.Shuffle([RECT_VERT, RECT_VERT, RECT_VERT,
			RECT_HORZ, RECT_HORZ, RECT_HORZ,
			RECT_OBLI, RECT_OBLI, RECT_OBLI]);
		this.rec_ori.pop();
		this.rec_pos = [];
		var pmv = new Phaser.Math.Vector2(0, 0);

		for (let i = 0; i < 8; i++) {
			pmv.setToPolar(i * Math.PI/4, 4.68 * ppd);
			this.rec_pos.push([pmv.x + centerx, pmv.y + centery]);
		}
	}

	precued() {
		game.scene.getScene("Train").children.getChildren().forEach((child) => {
				if (child.type === "Container" && child.name == "rectangles") {
					child.setVisible(false);
				}
		});
	}

	cuedisplay() {
	}

	memdisplay(s) {
		var rec_container = s.add.container();
		rec_container.setName("rectangles");

		for (let i = 0; i < 8; i++) {
				if (this.rec_ori[i] == RECT_HORZ) {
				var rect = new Phaser.GameObjects.Rectangle(s, 
					this.rec_pos[i][0], this.rec_pos[i][1], 
						1.16 * ppd, 0.29 * ppd, 0xffffff);
				} else if (this.rec_ori[i] == RECT_VERT) {
				var rect = new Phaser.GameObjects.Rectangle(s, 
						this.rec_pos[i][0], this.rec_pos[i][1], 
						1.16 * ppd, 0.29 * ppd, 0xffffff).setAngle(90);
				} else if (this.rec_ori[i] == RECT_OBLI) {
				var rect = new Phaser.GameObjects.Rectangle(s, 
						this.rec_pos[i][0], this.rec_pos[i][1], 
						1.16 * ppd, 0.29 * ppd, 0xffffff).setAngle(45);
				}
				rec_container.add(rect);
		}
	}
}

class Train extends Phaser.Scene {

	constructor ()
	{
		super({key: 'Train', active: true});
	}

	create ()
	{
		let graphics = this.add.graphics();
		graphics.fillStyle(0xff0000, 1);
		let fixation = new Phaser.Geom.Circle(centerx, centery, 0.4 * ppd);
		graphics.fillCircleShape(fixation);
		let atrial = new TrainTrial(this);
		atrial.memdisplay(this);
		let a = this.time.addEvent({delay: MD_TI + MDCUE_TI_MAX, 
					callback: atrial.cuedisplay, loop: false});
		let b = this.time.addEvent({delay: MD_TI, callback: atrial.precued, 
				loop: false});
	}
}

class Experiment extends Phaser.Scene {
	constructor ()
	{
		super({key: 'Experiment', active: false});
	}

	create()
	{
		let graphics = this.add.graphics();
		graphics.fillStyle(0xff9933, 1);
		graphics.fillRect(100, 200, 600, 300);
		graphics.fillRect(200, 100, 100, 100);

		this.add.text(220, 110, 'B', {font: '96px Courier', 
			fill: '#000000' });
	}
}

let config = {
	type: Phaser.AUTO,
	width: canvwidth,
	height: canvheight,
	backgrondColor: '#000000',
	parent: 'gamearea',
	scene: [Train, Experiment]
};

let game = new Phaser.Game(config);

