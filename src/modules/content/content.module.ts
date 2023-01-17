import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from 'src/submodules/backend-refresher-entities-1.0/src/entities/content-entity';
import { User } from 'src/submodules/backend-refresher-entities-1.0/src/entities/user.entity';
import ContentController from './content.controller';
import { ContentService } from './content.service';
import { Option } from 'src/submodules/backend-refresher-entities-1.0/src/entities/option.entity';
import { Group } from 'src/submodules/backend-refresher-entities-1.0/src/entities/group.entity';
import { Reaction } from 'src/submodules/backend-refresher-entities-1.0/src/entities/reaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Content, Option, Group, Reaction])],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}