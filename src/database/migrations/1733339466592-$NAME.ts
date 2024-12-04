import { MigrationInterface, QueryRunner } from "typeorm";

export class  $NAME1733339466592 implements MigrationInterface {
    name = ' $NAME1733339466592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Employee" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "age" integer NOT NULL, "class" character varying(20) NOT NULL, "subjects" text array NOT NULL, "attendance" integer NOT NULL, CONSTRAINT "PK_9a993c20751b9867abc60108433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Employee"`);
    }

}
