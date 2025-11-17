import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpensesTable1762983722743 implements MigrationInterface {
  name = 'CreateExpensesTable1762983722743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."expenses_category_enum" AS ENUM('food', 'transport', 'entertainment', 'utilities', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."expenses_type_enum" AS ENUM('income', 'expense')`,
    );
    await queryRunner.query(
      `CREATE TABLE "expenses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "description" character varying NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        "category" "public"."expenses_category_enum" NOT NULL,
        "type" "public"."expenses_type_enum" NOT NULL,
        "date" date,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "expenses"`);
    await queryRunner.query(`DROP TYPE "public"."expenses_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."expenses_category_enum"`);
  }
}
