/*
 *  The Seeing Ɔ, remembering C article specifies rectangle size in degrees.
 *  This can be converted to pixel units by
 *  y = pixels per degree; r = distance from display in inches; x = display PPI
 *  y = r*tan(pi/180)/x
 *  See https://www.mathworks.com/matlabcentral/answers/13191-what-does-the-term-display-visual-resolution-in-pixels-degree-means 
 *
 */
var dply_dst = 20;  // we are this much inches from display
var dply_diag = 15.5;	// display diagonal in inches
//var dply_wpx = window.innerWidth * window.devicePixelRatio;
var dply_wpx = window.innerWidth;
//var dply_hpx = window.innerHeight * window.devicePixelRatio;
var dply_hpx = window.innerHeight;
var ppi = Math.sqrt((dply_wpx * dply_wpx) + (dply_hpx * dply_hpx)) / dply_diag;
var ppd = dply_dst * (Math.PI/180)/ (1/ppi);  // pixels per degree
var canvwidth = 800;
var canvheight = 600;

const RECT_VERT = 1;
const RECT_HORZ = 2;
const RECT_OBLI = 3;

class TrainTrial {
	constructor() {
		/* rect params */
		this.rec_ori = Phaser.Utils.Array.Shuffle([RECT_VERT, RECT_VERT, RECT_VERT,
			RECT_HORZ, RECT_HORZ, RECT_HORZ,
			RECT_OBLI, RECT_OBLI, RECT_OBLI]);
			this.rec_ori.pop();
			this.rec_pos = [[100, 200], [75, 150], [50, 100], [75, 75],
				[100, 100], [125, 300], [400, 500], [350, 200]];
	}

	memdisplay(s, g) {
		console.log(this.rec_ori);
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
				s.add.existing(rect);
		//		g.fillRectShape(rect);
		//	graphics.fillRect(100, 200, 1.16 * ppd, 0.29 * ppd);
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
		let fixation = new Phaser.Geom.Circle(0, 0, 0.4 * ppd);
		graphics.fillCircleShape(fixation);
		let atrial = new TrainTrial();
		atrial.memdisplay(this, graphics);
	}
}

class Experiment extends Phaser.Scene {
	constructor ()
	{
		super({key: 'Expriment', active: false});
	}

	create()
	{
		let graphics = this.add.graphics();
		graphics.fillStyle(0xff9933, 1);
		graphics.fillRect(100, 200, 600, 300);
		graphics.fillRect(200, 100, 100, 100);

		this.add.text(220, 110, 'B', {font: '96[x Courier', 
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

