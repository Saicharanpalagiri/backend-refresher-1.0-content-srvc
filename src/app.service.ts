import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RMQPayloadDto } from './submodules/backend-refresher-1.0-rmq/src/dtos/rmqPayload.dto';
import { PlatformEvents } from './submodules/backend-refresher-1.0-rmq/src/enums/platformEvents';
import { RmqTopics } from './submodules/backend-refresher-1.0-rmq/src/enums/rmqTopics';
import { MsgBrokerOpsService } from './submodules/backend-refresher-1.0-rmq/src/module/msg-broker-ops/msg-broker-ops.service';

@Injectable()
export class AppService {
  constructor(
    @Inject('CONTENT_SERVICE_QUEUE') private contentQueueClient: ClientProxy,

    private readonly msgBrokerService: MsgBrokerOpsService,
  ){}

  getHello(): string {
    let rmqPayload: RMQPayloadDto = {
      event: PlatformEvents.CONTENT_CREATION,
      payload: {
        title: 'Test',
      }
    }

    this.msgBrokerService.emitToQueue(
      rmqPayload,
      RmqTopics.CONTENT_CREATION_TOPIC,
      this.contentQueueClient
    )
    return 'emit successful';
  }
}
