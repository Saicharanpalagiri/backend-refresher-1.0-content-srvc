import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentModule } from './modules/content/content.module';
import { queues } from './submodules/backend-refresher-1.0-rmq/src/constants/rmqQueues';
import { MsgBrokerOpsService } from './submodules/backend-refresher-1.0-rmq/src/module/msg-broker-ops/msg-broker-ops.service';
import { Content } from './submodules/backend-refresher-entities-1.0/src/entities/content-entity';
import { User } from './submodules/backend-refresher-entities-1.0/src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'mydatabase-instance.cc1kuvxcs7tm.ap-northeast-1.rds.amazonaws.com',
      port: 5432,
      username: 'charan',
      password: 'charan123',
      database: 'backend-socialmedia',
      entities: [User, Content],
      synchronize: true,
      logging: false
    }),
    ClientsModule.register([
      {
        name: 'CONTENT_SERVICE_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: [
            'amqps://ghdswtyl:0tdkAKnW71Ty8Pe3JVvDtd3qI43pr2fX@puffin.rmq2.cloudamqp.com/ghdswtyl',
          ],
          queue: queues.CONTENT_SERVICE_QUEUE,
          queueOptions: {
            durable: true,
          }
        },
      },
    ]),
    ContentModule,
    TypeOrmModule.forFeature([User, Content]),
  ],
  controllers: [AppController],
  providers: [AppService, MsgBrokerOpsService],
})
export class AppModule {}
