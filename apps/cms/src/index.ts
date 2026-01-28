// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    console.log('--- Production Password Reset Bootstrap ---');
    try {
      const user = await strapi.db.query('admin::user').findOne({
        where: { email: 'berkeklc.123@gmail.com' },
      });

      if (user) {
        console.log('Found admin user, resetting password...');
        await strapi.service('admin::user').updateById(user.id, {
          password: 'RushZanzibar2026!',
        });
        console.log('SUCCESS: Password reset for production.');
      } else {
        console.log('User berkeklc.123@gmail.com not found in database.');
      }
    } catch (error) {
      console.error('FAILED: Password reset bootstrap error:', error);
    }
    console.log('------------------------------------------');
  },
};
