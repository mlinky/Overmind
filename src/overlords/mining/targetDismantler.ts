import { CreepSetup } from 'creepSetups/CreepSetup';
import { DirectiveTargetDismantle } from 'directives/colony/targetDismantle';
import {CombatSetups, Roles, Setups} from '../../creepSetups/setups';
import {OverlordPriority} from '../../priorities/priorities_overlords';
import {profile} from '../../profiler/decorator';
import {Tasks} from '../../tasks/Tasks';
import {Zerg} from '../../zerg/Zerg';
import {Overlord} from '../Overlord';

/**
 * Dismantle a structure
 */
@profile
export class TargetDismantleOverlord extends Overlord {

	dismantlers: Zerg[];
	directive: DirectiveTargetDismantle;
	setup: CreepSetup;

	constructor(directive: DirectiveTargetDismantle) {
		super(directive, 'targetDismantle', OverlordPriority.maintenance.dismantle);
		this.directive = directive;
		this.dismantlers = this.zerg(Roles.dismantler);
		this.setup=CombatSetups.dismantlers.tonka;
	}

	init() {
		this.wishlist(1, this.setup);
	}

	private handleDismantle(dismantler: Zerg): void {
		if (dismantler.room == this.room && !dismantler.pos.isEdge) {
			const target = this.directive.getTarget();

			if (target) {
				dismantler.task = Tasks.dismantle(target);
			}

		} else {
			dismantler.goTo(this.pos, {ensurePath: true, avoidSK: true, waypoints: this.directive.waypoints});
		}
	}

	run() {
		this.autoRun(this.dismantlers, dismantler => this.handleDismantle(dismantler));
	}
}
