function setRecVisible(val, dest=false) {  
	game.scene.getScene("Train").children
		.getChildren().forEach((child) => {
				if (child.type === "Container" && 
						child.name == "rectangles") {
					child.setVisible(val);
					if (dest == true) {
							child.destroy();
					}
				}
		});
}

function showTrainResults() {
		let outtable = '';
		let corrects = 0;

		for (let i = 0; i < gamestats.TrainActual.length; i++) {
				outtable += '<tr>';
				outtable += '<td>';
				if (gamestats.TrainActual[i] == true) {
						outtable += 'T';
				} else { outtable += 'F'; }
				outtable += '</td><td>';

				if (gamestats.TrainAnswered[i] == true){
						outtable += 'T';
				} else { outtable += 'F'; }

				if (gamestats.TrainActual[i] == gamestats.TrainAnswered[i]) {
						outtable += '<td>&#x2713</td>';
						corrects++;
				} else {
						outtable += '<td>&#x2715</td>';
				}
				outtable += '</td></tr>';
		}
		let cpercent = Math.round(100 * (corrects / gamestats.TrainActual.length));
		outtable += '<tr><td colspan="3">Score: ' + cpercent + '%</td></tr>';
		let table = '<br /><table id="trainstats"><tr><th>Orientation<br />changed</th><th>Your<br />answer</th><th></th></tr>';
		table += outtable + '</table><br />';

		if (cpercent > 75) {
		    table += '<br />You are ready for the actual experiment.<br />By pressing C these stats will be cleared and the actual experiment will begin.<br />Immediately, a screen with letters will flash, which you will be tested on after other flashes. These other flashes will either indicate which letter or try to interfere.';
		    //		    game.scene.switch("Train", "Experiment");
		} else {
				table += '<br />More training required. Refresh (F5) to restart.';
		}
		document.querySelector('#traininst').innerHTML += table;
}


class TrainTrial {
	constructor(s) {
		this.phaserscene = s;
		this.trecrot = false;	/* target rectanglerotated */
		var pmv;
		/* rect params */
	    this.rec_ori = Phaser.Utils.Array.Shuffle([RECT_VERT,
				RECT_VERT, RECT_VERT,
			RECT_HORZ, RECT_HORZ, RECT_HORZ,
			RECT_OBLI, RECT_OBLI, RECT_OBLI]);
		this.rec_ori.pop();
		this.rec_pos = [];
		var pmv = new Phaser.Math.Vector2(0, 0);

		for (let i = 0; i < 8; i++) {
			pmv.setToPolar(i * Math.PI/4, 4.68 * ppd);
			this.rec_pos.push([pmv.x + centerx, pmv.y + centery]);
		}
		this.randtargeti = Phaser.Math.RND.between(0, 7);
	}

	precued() {
		setRecVisible(false);

		if (Phaser.Math.RND.integerInRange(0, 1) == 1) {
			this.trecrot = true;
			game.scene.getScene("Train").children.getChildren().forEach((child) =>{
					if (child.type === "Container" && 
							child.name == "rectangles")
					{
						child.list.forEach((rec, i) => {
							if(i == this.randtargeti) {
								rec.setOrigin(0.5, 0.5)
									.setAngle(rec.angle + 90);
							}
						});
					}
			});
		}
		gamestats.TrainActual.push(this.trecrot);
	}

	cuedisplay() {
			let [trecx, trecy] = this.rec_pos[this.randtargeti];
	    let pmv = new Phaser.Math.Vector2(0, 0);
			pmv.setToPolar(this.randtargeti * Math.PI/4,
					Phaser.Math.RND.between(-1.6, 1.6) * ppd);
			trecx += pmv.x;
			trecy += pmv.y;
			pmv.reset();
			pmv.setToPolar(this.randtargeti * Math.PI/4,
					Phaser.Math.RND.between(-0.93, 0.93) * ppd);
			let tfocx = pmv.x + centerx;
			let tfocy = pmv.y + centery;
			let line = new Phaser.GameObjects.Line(game.scene.getScene("Train"),
					tfocx, tfocy, 0, 0, trecx - centerx, trecy - centery, 
					0xffff00).setOrigin(0, 0).setName("Cueline");
			game.scene.getScene("Train").add.existing(line);
			this.phaserscene.time.addEvent({delay: CD_TI, 
					callback: () => { 
			game.scene.getScene("Train").children.getChildren().forEach((ch) => {
				if (ch.name == "Cueline") {
					ch.setVisible(false);
					setRecVisible(true);
				}
			}); }, callbackScope: this, loop: false});
	}

	memdisplay(s) {
		var rec_container = s.add.container();
		rec_container.setName("rectangles");

		for (let i = 0; i < 8; i++) {
				if (this.rec_ori[i] == RECT_HORZ) {
				var rect = new Phaser.GameObjects.Rectangle(s, 
					this.rec_pos[i][0], this.rec_pos[i][1], 
						1.16 * ppd,
						0.29 * ppd, 0xffffff);
				} else if (this.rec_ori[i] == RECT_VERT) {
				var rect = new Phaser.GameObjects.Rectangle(s, 
						this.rec_pos[i][0], this.rec_pos[i][1], 
						1.16 * ppd,
						0.29 * ppd,
						0xffffff).setAngle(90);
				} else if (this.rec_ori[i] == RECT_OBLI) {
				var rect = new Phaser.GameObjects.Rectangle(s, 
						this.rec_pos[i][0], this.rec_pos[i][1], 
						1.16 * ppd,
					        0.29 * ppd,
					        0xffffff).setAngle(45);
				}
				rec_container.add(rect);
		}
	}
}


export class Train extends Phaser.Scene {
	constructor ()
	{
	    super({key: 'Train', active: true});
	    this.numtrials = NUM_TRAINTRIALS;
	    this.endoftrial = true;
	    this.endoftraining = false;
	}

	update ()
	{
		if (this.endoftrial == true && this.numtrials > 0) {
			this.time.addEvent({delay: TRIAL_TI, callback: () => {
				document.querySelector("span#triali").innerHTML = NUM_TRAINTRIALS - this.numtrials + 1;
				let atrial = new TrainTrial(this);
				atrial.memdisplay(this);
				let mdcue = Phaser.Math.RND.between(MDCUE_TI_MIN, MDCUE_TI_MAX);
				this.time.addEvent({delay: MD_TI + mdcue, 
					callback: atrial.cuedisplay, 
					callbackScope: atrial, loop: false});
		 		this.time.addEvent({delay: MD_TI, callback: atrial.precued, 
				 	callbackScope: atrial,
				 	loop: false});
			}, callbackScope: this, loop:false});
		    //this.numtrials--;
		    this.endoftrial = false;
		}
	}

	create ()
	{
		let graphics = this.add.graphics();
		graphics.fillStyle(0xff0000, 1);
	        let fixation = new Phaser.Geom.Circle(centerx,
						  centery, 0.4 * ppd);
	    graphics.fillCircleShape(fixation);
	    console.log("here is " + NUM_TRAINTRIALS);
		document.querySelector("span#trialn").innerHTML = NUM_TRAINTRIALS;
		let traininst = document.querySelector('#traininst');
	    traininst.style.display = "block";
	    
	    this.input.keyboard.on('keydown-C', event => {
		console.log("C is down and endoftrainig is " + this.endoftraining);
		if (this.endoftraining == true) {
		    console.log("stopping train scene and startig experiment scene");
		    document.getElementById("traininst").remove();
		    let experimentinst = document.querySelector('#experimentinst');
		    experimentinst.style.display = "block";
		    this.scene.start("Experiment");
		}
	    });
	    
		 this.input.keyboard.on('keydown-Y', event => {
				 if (this.endoftrial == false) {
					this.numtrials--;
					gamestats.TrainAnswered.push(true);

					if (this.numtrials > 0) {
					    this.endoftrial = true;
						setRecVisible(false, true);
					} else {
					    this.endoftraining = true;
					    showTrainResults();
					}
				}
		 });
		 this.input.keyboard.on('keydown-N', event => {
				 if (this.endoftrial == false) {
						this.numtrials--;
						gamestats.TrainAnswered.push(false);

						 if (this.numtrials > 0) {
							this.endoftrial = true;
							setRecVisible(false, true);
						 } else {
						     this.endoftraining = true;
							showTrainResults();
						 }
				 }
		});
	}
}
