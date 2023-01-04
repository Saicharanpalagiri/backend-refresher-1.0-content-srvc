import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentDto } from './submodules/backend-refresher-1.0-dtos/src/dtos/content.dto';
import { RMQPayloadDto } from './submodules/backend-refresher-1.0-rmq/src/dtos/rmqPayload.dto';
import { PlatformEvents } from './submodules/backend-refresher-1.0-rmq/src/enums/platformEvents';
import { RmqTopics } from './submodules/backend-refresher-1.0-rmq/src/enums/rmqTopics';
import { MsgBrokerOpsService } from './submodules/backend-refresher-1.0-rmq/src/module/msg-broker-ops/msg-broker-ops.service';
import { Content } from './submodules/backend-refresher-entities-1.0/src/entities/content-entity';

@Injectable()
export class AppService {

  constructor(
    @Inject('CONTENT_SERVICE_QUEUE') private contentQueueClient: ClientProxy,

    private readonly msgBrokerService: MsgBrokerOpsService,

    @InjectRepository(Content) 
    private contentRepository: Repository<Content>,
  ){}

  getHello(): string {
    console.log('Step 2');

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

  async createContent(content: ContentDto){
    console.log('Proceeding to create content');
    console.log('step2')
    let rmqPayload: RMQPayloadDto = {
      event: PlatformEvents.CONTENT_CREATION,
      payload: content
    }

    this.msgBrokerService.emitToQueue(
      rmqPayload,
      RmqTopics.CONTENT_CREATION_TOPIC,
      this.contentQueueClient
    )

    return 'Your request has been accepted !!';
  }

  async updateContent(content: ContentDto) {
    
    let fetchedUser=await this.contentRepository.findOneBy({
      id: content.id,
    });
    if(!fetchedUser){
      return 'No content Found With specified id';
    }
    let rmqPayload: RMQPayloadDto = {
      event: PlatformEvents.CONTENT_UPDATION,
      payload: content
    }

    this.msgBrokerService.emitToQueue(
      rmqPayload,
      RmqTopics.CONTENT_UPDATION_TOPIC,
      this.contentQueueClient
    )

    return 'Your request has been accepted  and updated!!';
  }
}