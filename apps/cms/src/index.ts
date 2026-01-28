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
    console.log('--- EMERGENCY ADMIN ACCESS RECOVERY ---');
    try {
      const adminService = strapi.service('admin::user');
      const users = await strapi.db.query('admin::user').findMany();

      console.log(`Found ${users.length} admin users.`);
      for (const user of users) {
        console.log(`Resetting password for: ${user.email}`);
        await adminService.updateById(user.id, {
          password: 'RushZanzibar2026!',
        });
      }
      console.log('Access recovery script finished.');
    } catch (error) {
      console.error('Access recovery failed:', error);
    }
    console.log('---------------------------------------');
  },
};
