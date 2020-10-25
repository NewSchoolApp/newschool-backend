import * as PubSub from 'pubsub-js';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';
import { TestOnFirstTake } from './course-rewards.service';
import { EventNameEnum } from '../enum/event-name.enum';
import { Test } from '../../CourseModule/entity/test.entity';
import { User } from '../../UserModule/entity/user.entity';
import { StartEventEnum } from '../enum/start-event.enum';
import { StartEventRules } from '../dto/start-event-rules.dto';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { InviteUserRewardData } from './user-rewards.service';

@Injectable()
export class PublisherService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly jwtService: JwtService,
  ) {}

  public startEvent(eventName: StartEventEnum, rule: StartEventRules): void {
    const authorizationHeader = this.request.headers.authorization;
    const userStringToken = this.getUserStringToken(authorizationHeader);
    const user: User = this.getUserFromToken(userStringToken);
    if (user.role.name !== RoleEnum.STUDENT) return;
    const events = {
      [StartEventEnum.SHARE_COURSE]: EventNameEnum.USER_REWARD_SHARE_COURSE,
      [StartEventEnum.RATE_APP]: EventNameEnum.USER_REWARD_RATE_APP,
    };
    const event = events[eventName];
    if (!event) return;
    PubSub.publish(event, rule);
  }

  public emitInviteUserReward(inviteKey: string): void {
    const data: InviteUserRewardData = {
      inviteKey,
    };
    PubSub.publish(EventNameEnum.USER_REWARD_INVITE_USER, data);
  }

  public emitCheckTestReward(test: Test, chosenAlternative: string): void {
    const authorizationHeader = this.request.headers.authorization;
    const userStringToken = this.getUserStringToken(authorizationHeader);
    const user: User = this.getUserFromToken(userStringToken);
    if (user.role.name !== RoleEnum.STUDENT) return;

    const data: TestOnFirstTake = {
      chosenAlternative: chosenAlternative.toLowerCase(),
      user,
      test,
    };
    PubSub.publish(EventNameEnum.COURSE_REWARD_TEST_ON_FIRST_TAKE, data);
  }
  public emitupdateStudent(id: string): void {
    PubSub.publish(EventNameEnum.USER_REWARD_COMPLETE_REGISTRATION, { id });
  }

  private getUserStringToken(authorizationHeader: string): string {
    const [, userStringToken] = authorizationHeader.split(' ');
    return userStringToken;
  }

  private getUserFromToken(userStringToken: string): User {
    return this.jwtService.verify<User>(userStringToken, {
      ignoreExpiration: true,
    });
  }
}
