import { log } from 'console/log';
import { CreepSetup } from 'creepSetups/CreepSetup';
import { DirectiveWallDestroy } from 'directives/offense/wallDestroy';
import {$} from '../../caching/GlobalCache';
import {CombatSetups, Roles, Setups} from '../../creepSetups/setups';
import {Directive} from '../../directives/Directive';
import {Pathing} from '../../movement/Pathing';
import {OverlordPriority} from '../../priorities/priorities_overlords';
import {profile} from '../../profiler/decorator';
import {Tasks} from '../../tasks/Tasks';
import {Zerg} from '../../zerg/Zerg';
import {Overlord} from '../Overlord';

/**
 * Destroy a wall
 */
@profile
export class WallDestroyOverlord extends Overlord {

	wallDestroyers: Zerg[];
	directive: DirectiveWallDestroy;
	setup: CreepSetup;

	constructor(directive: DirectiveWallDestroy) {
		super(directive, 'wallDestroy', OverlordPriority.maintenance.wallDestroy);
		this.directive = directive;
		this.wallDestroyers = this.zerg(Roles.dismantler);
		this.setup=CombatSetups.dismantlers.default;
	}

	init() {
		this.wishlist(1, this.setup);
	}

	private handleWallDestroyer(wallDestroyer: Zerg): void {
		if (wallDestroyer.room == this.room && !wallDestroyer.pos.isEdge) {
			const target = this.directive.getTarget();

			if (target) {
				wallDestroyer.task = Tasks.dismantle(target);
			}

		} else {
			wallDestroyer.goTo(this.pos, {ensurePath: true, avoidSK: true, waypoints: this.directive.waypoints});
		}
	}

	run() {
		this.autoRun(this.wallDestroyers, wallDestroyer => this.handleWallDestroyer(wallDestroyer));
	}
}
