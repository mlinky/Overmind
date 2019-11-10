import { Roles } from 'creepSetups/setups';
import {TargetDismantleOverlord } from 'overlords/mining/targetDismantler';
import {log} from '../../console/log';
import {profile} from '../../profiler/decorator';
import {Directive} from '../Directive';
import { DirectiveTargetDismantle } from './targetDismantle';

/**
 * Spawns a creep to dismantle a structure
 */
@profile
export class DirectiveBulkDismantle extends Directive {

	static directiveName = 'bulkDismantle';
	static color = COLOR_PURPLE;
	static secondaryColor = COLOR_RED;

	constructor(flag: Flag) {
		super(flag);
	}

	spawnMoarOverlords() {
 		
	}

	init(): void {
		
	}

	run(): void {
		if (Game.time % 10 == 0) {
			const flags = this.colony.flags.filter(flag => flag.color == COLOR_PURPLE && flag.secondaryColor == COLOR_BLUE);
			
			if (flags.length < 3 && this.room) {
				// We have fewer than 4 dismantlers in the colony - place directives
				// log.info(`Constructed walls ${this.room.constructedWalls.length}`);
				// log.info(`Flags ${this.room.flags.length}`);
				const walls = this.room.constructedWalls.filter(wall => 
									this.room!.flags.filter(flag => flag.pos.x == wall.pos.x && flag.pos.y == wall.pos.y).length == 0);
				
				// log.info(`Filtered walls ${walls.length}`);
				
				const target = _.max(walls, wall => wall.hits);

				if (target) {
					DirectiveTargetDismantle.create(target.pos);
					// log.info(`Propose pos ${target.pos}`);
				} else {
					// Nothing more to target
					this.remove();
				}
			}
		}
	}
}
