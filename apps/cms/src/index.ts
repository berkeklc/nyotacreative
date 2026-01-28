export default {
  register() { },

  async bootstrap({ strapi }: { strapi: any }) {
    // Run the recovery in the background after a short delay to ensure Strapi is ready
    // and to prevent it from blocking the main process if something goes wrong.
    setTimeout(async () => {
      const log = (msg: string) => console.log(`[AUTH-DEBUG] ${msg}`);
      log('Background recovery script started');

      try {
        const email = 'berkeklc.123@gmail.com';
        const password = 'RushZanzibar2026!';

        // Use db query which is more stable during bootstrap
        const user = await strapi.db.query('admin::user').findOne({ where: { email } });

        if (user) {
          log(`User ${email} found. Updating password...`);
          // We need to hash the password manually if we don't use the service, 
          // or we can try using the service here as the server is already up.
          const adminService = strapi.service('admin::user');
          if (adminService) {
            await adminService.updateById(user.id, {
              password,
              isActive: true,
              blocked: false
            });
            log('Password updated successfully via service.');
          } else {
            log('Admin service not found, update failed.');
          }
        } else {
          log(`User ${email} not found. Checking roles...`);
          const superAdminRole = await strapi.db.query('admin::role').findOne({
            where: { code: 'strapi-super-admin' }
          });

          if (superAdminRole && strapi.service('admin::user')) {
            log('Creating new super admin...');
            await strapi.service('admin::user').create({
              email,
              password,
              firstname: 'Admin',
              lastname: 'Rush',
              roles: [superAdminRole.id],
              isActive: true
            });
            log('New super admin created.');
          }
        }
      } catch (err: any) {
        console.error('[AUTH-DEBUG] Error during background recovery:', err.message);
      }
    }, 5000); // 5 second delay
  },
};
