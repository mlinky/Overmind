import { log } from 'console/log';
import { CreepSetup } from 'creepSetups/CreepSetup';
import { DirectiveWallMine } from 'directives/colony/wallMine';
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
export class WallMineOverlord extends Overlord {

	wallMiners: Zerg[];
	directive: DirectiveWallMine;
	setup: CreepSetup;

	constructor(directive: DirectiveWallMine) {
		super(directive, 'wallMine', OverlordPriority.maintenance.wallMine);
		this.directive = directive;
		this.wallMiners = this.zerg(Roles.dismantler);
		this.setup=CombatSetups.dismantlers.wallMiner;
	}

	init() {
		const count = this.colony.getZergByRole(Roles.dismantler).length;
		// log.info(`${this.directive.pos.roomName} - ${Roles.dismantler} count ${count}`);
		if (count < 3) {
			this.wishlist(1, this.setup);
		}
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
		this.autoRun(this.wallMiners, wallDestroyer => this.handleWallDestroyer(wallDestroyer));
	}
}
