import {Train} from './train.js';
import {Experiment} from './experiment.js';


let config = {
	type: Phaser.AUTO,
	width: canvwidth,
	height: canvheight,
	backgrondColor: '#000000',
	parent: 'gamearea',
	input: { queue: true },
    scene: [Train, Experiment]
    //scene: [Experiment]
};
game = new Phaser.Game(config);

