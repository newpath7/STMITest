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

var LETTERS = ["B", "C", "D", "E", "F", "G", "J", "K",
		 "L", "N", "P", "Q", "R", "S", "Z"];
const LETTER_FONT = "26px Courier";

/* shorti, short, long */
const pause_fac = 1;
const TRIAL_TYPE_PAUSES = [[250 * pause_fac, 750 * pause_fac, 500 * pause_fac, 0, 0],
	[250 * pause_fac, 750 * pause_fac, 500 * pause_fac, 3750 * pause_fac, 500 * pause_fac],
	[250 * pause_fac, 3000 * pause_fac, 500 * pause_fac, 1500 * pause_fac, 500 * pause_fac]];

const SESSIONS_PER_GAME = 2;
const BLOCKS_PER_SESSION = 18;
const TRIALS_PER_BLOCK = 24;

const RECT_VERT = 1;
const RECT_HORZ = 2;
const RECT_OBLI = 3;

/* time intervals in ms */
const TRIAL_TI = 1000;	// intertrial pause (not specified in paper)
const MD_TI = 250;	// memory display time interval
const MDCUE_TI_MIN = 100;		// min memory display to cue
const MDCUE_TI_MAX = 1000;	// max memory display to cue
const CD_TI = 500;		// cue display	

const NUM_TRAINTRIALS = 5;


class gameStats {
    constructor() {
	this.TrainActual = [];
	this.TrainAnswered = [];
    }
 }
 
var gamestats = new gameStats();
var game;
