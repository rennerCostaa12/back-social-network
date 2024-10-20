import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmoticons1729427897324 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('emoticons')
      .values([
        {
          id: 1,
          image:
            'https://cdn3d.iconscout.com/3d/premium/thumb/like-emoji-5756724-4826108.png?f=webp',
          description: 'emoticon gostar',
          order: 1,
          categoriesEmojiId: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          image:
            'https://dejpknyizje2n.cloudfront.net/media/carstickers/versions/cute-laughing-emoji-sticker-u6b61-x450.png',
          description: 'emoticon de risos',
          order: 2,
          categoriesEmojiId: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          image: 'https://cdn-icons-png.freepik.com/512/11202/11202657.png',
          description: 'emoticon de ódio',
          order: 3,
          categoriesEmojiId: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('emoticons')
      .where('id IN (:...ids)', { ids: [1, 2, 3] })
      .execute();
  }
}
