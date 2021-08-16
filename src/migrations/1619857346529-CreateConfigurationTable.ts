import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConfigurationTable1619857346529
  implements MigrationInterface {
  name = 'CreateConfigurationTable1619857346529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "configuration" ("section" character varying NOT NULL, "name" character varying NOT NULL, "value" character varying NOT NULL, "type" smallint NOT NULL, CONSTRAINT "PK_9bfa165ae0185c0617b5e81b41a" PRIMARY KEY ("section", "name"))`,
    );

    await queryRunner.query(
      `INSERT INTO configuration (section, name, value, type)
        VALUES (
            'global',
            'requireInstallation',
            'true',
            '3'
          );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "configuration"`);
  }
}
