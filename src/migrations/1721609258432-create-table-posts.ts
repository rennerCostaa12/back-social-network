import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTablePosts1721609258432 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          { name: 'picture', type: 'varchar', isNullable: false },
          {
            name: 'city_id',
            type: 'int',
            isNullable: false,
          },
          { name: 'tags', type: 'varchar', isNullable: true },
          { name: 'statusPostsId', type: 'int', isNullable: false },
          { name: 'userId', type: 'varchar', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['statusPostsId'],
            referencedTableName: 'status_posts',
            referencedColumnNames: ['id'],
          },
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('posts');
  }
}
