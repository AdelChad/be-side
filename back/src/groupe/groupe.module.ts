import { Module } from '@nestjs/common';
import { GroupeController } from './groupe.controller';
import { GroupeService } from './groupe.service';
import { Groupe } from './groupe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Groupe, User]), UserModule],
  controllers: [GroupeController],
  providers: [GroupeService],
  exports: [GroupeService]
})

export class GroupeModule {}