import {log} from '../../console/log';
import {SwarmDestroyerOverlord} from '../../overlords/offense/swarmDestroyer';
import {profile} from '../../profiler/decorator';
import {Visualizer} from '../../visuals/Visualizer';
import {Directive} from '../Directive';

/**
 * Spawns a creep to destroy a wall
 */
@profile
export class DirectiveWallDestroy extends Directive {

	static directiveName = 'wallDestroy';
	static color = COLOR_RED;
	static secondaryColor = COLOR_PURPLE;

	constructor(flag: Flag) {
		super(flag);
	}

	spawnMoarOverlords() {
// 		this.overlords.scout = new StationaryScoutOverlord(this); // TODO: Not have a scout at all times
// 		this.overlords.controllerAttack = new ControllerAttackerOverlord(this);
	}

	init(): void {
		const level: string = this.room && this.room.controller ? this.room.controller.level.toString() : '???';
		this.alert(`Destroying wall in ${this.room!.name}`);
	}

	run(): void {
		if (this.room && this.room.controller && this.room.controller.level == 0) {
			log.notify(`Removing ${this.name} since controller has reached level 0.`);
			this.remove();
		}
	}
}
