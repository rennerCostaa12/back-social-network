import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableStatusPosts1721608834226 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'status_posts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '150', isNullable: false },
          {
            name: 'description',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('status_posts')
      .values([
        {
          id: 1,
          name: 'analise',
          description: 'Posts em análises',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'bloqueado',
          description: 'Posts bloqueados',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: 'sucesso',
          description: 'Posts que passaram com sucesso no processo de análise',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]).execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('status_posts');
  }
}
