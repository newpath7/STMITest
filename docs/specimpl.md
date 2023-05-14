Some requirements and specifications for Experiment Trials phase
================================================================

* 2 sessions of 18 blocks of 24 trials (864 total trials)

* Should start off with instructions:
"Indicate the letter that appeared at the cue location"
"Becareful to not confuse real and pseudo-letters."


### 3 trial types, randomly intermixed
1. "shorti": Memory Display 0.25s -> 0.75s -> (Memory Probe & Interference) 0.5s -> Select Target -> Indicate Certainty -> beep wrong/correct sound
2. "short": Memory Display 0.25s -> 0.75s -> Memory Probe 0.5s -> 3.75s -> Interference 0.5s -> Select Target -> Indicate Certainty -> beep wrong/correct sound
3. "long": Memory Display 0.25s -> 3s -> Memory Probe 0.5s -> 1.5s -> Interference 0.5s -> Select Target -> Indicate Certainty -> beep wrong/correct sound


Memory Display
--------------
    1. - 5 letters + 1 pseudo letter (50% chance)
        - 5 letters + 2 pseudo letters (50% chance)
    2. 6 letters + 2 pseudo-letters

Interference display
---------------------
For current trial whichever of a.1, a.2, or b was chosen for Memory Display, but indepently generated
   

Response display (Select Target)
--------------------------------
- 6 letters:
    - target letter from memory display			1
        - if a pseudo-letter
	        - 50% times use same pseudo-letter
	        - 50% times use real letter version  (critical trial)
        - if a real letter
            - 84% times use same real letter
            - 16% times use pseudo-letter version (critical trial)
    - 2 randomly chosen letters from memory display	2
    - 3 randomly chosen letters not from memory display	3

*Target letter was a real letter in 75% of trials and a pseudo-letter in remaining 25%*
