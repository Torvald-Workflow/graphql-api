import { Column, Entity, PrimaryColumn } from 'typeorm';
import { SETTING_TYPE } from '../interfaces/settings.type';

@Entity()
export class Configuration {
  @PrimaryColumn()
  section: string;

  @PrimaryColumn()
  name: string;

  @Column({ nullable: false })
  value: string;

  @Column({ type: 'smallint', enum: SETTING_TYPE })
  type: number;
}
