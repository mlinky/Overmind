import {TargetDismantleOverlord } from 'overlords/mining/targetDismantler';
import {log} from '../../console/log';
import {profile} from '../../profiler/decorator';
import {Directive} from '../Directive';

/**
 * Spawns a creep to dismantle a structure
 */
@profile
export class DirectiveTargetDismantle extends Directive {

	static directiveName = 'targetDismantle';
	static color = COLOR_PURPLE;
	static secondaryColor = COLOR_BLUE;

	constructor(flag: Flag) {
		super(flag);
	}

	spawnMoarOverlords() {
 		this.overlords.wallMine = new TargetDismantleOverlord(this);
	}

	init(): void {
		this.alert(`Dismantling in ${this.pos.roomName}`);
	}

	getTarget(): Structure | undefined {
		const targetedStructures = this.pos.lookFor(LOOK_STRUCTURES) as Structure[];
		for (const structure of targetedStructures) {
			if (structure.structureType == STRUCTURE_WALL || STRUCTURE_INVADER_CORE) {
				return structure;
			}
		}
	}

	run(): void {
		if (this.pos.isVisible) {
			const target = this.getTarget();
			if (!target) {
				log.info(`Removing target dismantle directive`);
				this.remove();
			}
		}
	}
}
