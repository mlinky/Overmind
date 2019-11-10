import { CombatSetups, Roles } from 'creepSetups/setups';
import { WallMineOverlord } from 'overlords/mining/wallMiner';
import { WallDestroyOverlord } from 'overlords/offense/wallDestroyer';
import { OverlordPriority } from 'priorities/priorities_overlords';
import { Visualizer } from 'visuals/Visualizer';
import {log} from '../../console/log';
import {profile} from '../../profiler/decorator';
import {Directive} from '../Directive';

/**
 * Spawns a creep to mine a wall
 */
@profile
export class DirectiveWallMine extends Directive {

	static directiveName = 'wallMine';
	static color = COLOR_PURPLE;
	static secondaryColor = COLOR_BLUE;

	constructor(flag: Flag) {
		super(flag);
	}

	spawnMoarOverlords() {
 		this.overlords.wallMine = new WallMineOverlord(this);
	}

	init(): void {
		this.alert(`Mining wall in ${this.pos.roomName}`);
	}

	getTarget(): Structure | undefined {
		const targetedStructures = this.pos.lookFor(LOOK_STRUCTURES) as Structure[];
		for (const structure of targetedStructures) {
			if (structure.structureType == STRUCTURE_WALL) {
				return structure;
			}
		}
	}

	run(): void {
		if (this.pos.isVisible) {
			const target = this.getTarget();
			if (!target) {
				log.info(`Removing wall destroy directive`);
				this.remove();
			}
		}
	}
}
