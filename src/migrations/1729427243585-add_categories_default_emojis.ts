import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCategoriesDefaultEmojis1729427243585
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('categories_emojis')
      .values([
        {
          id: 1,
          name: 'Gostei',
          description: 'Gostar do post',
          image:
            'https://t4.ftcdn.net/jpg/04/89/39/47/360_F_489394725_Oox6jg48u2K0FSk4RlPCzqkU7Qvu2BSu.jpg',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'Risos',
          description: 'Risos do posts',
          image:
            'https://t3.ftcdn.net/jpg/05/33/59/36/360_F_533593680_S9CHFGBeTsMuwwXeB1KpaPGr3N6uALA6.jpg',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 3,
          name: 'Odiar',
          description: 'Odiar o post',
          image:
            'https://img.freepik.com/vetores-gratis/ilustracao-de-emoji-de-odio-em-gradiente_23-2151041651.jpg',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
