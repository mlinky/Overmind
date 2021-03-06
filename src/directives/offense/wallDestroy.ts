import { WallDestroyOverlord } from 'overlords/offense/wallDestroyer';
import { Visualizer } from 'visuals/Visualizer';
import {log} from '../../console/log';
import {profile} from '../../profiler/decorator';
import {Directive} from '../Directive';

/**
 * Spawns a creep to destroy a wall
 */
@profile
export class DirectiveWallDestroy extends Directive {

	static directiveName = 'wallDestroy';
	static color = COLOR_RED;
	static secondaryColor = COLOR_BLUE;

	constructor(flag: Flag) {
		super(flag);
	}

	spawnMoarOverlords() {
 		this.overlords.wallDestroy = new WallDestroyOverlord(this);
	}

	init(): void {
		this.alert(`Destroying wall in ${this.pos.roomName}`);
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
