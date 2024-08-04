import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnCommentInPosts1722791790496
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'posts',
      new TableColumn({
        name: 'comment',
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('posts', 'comment');
  }
}
