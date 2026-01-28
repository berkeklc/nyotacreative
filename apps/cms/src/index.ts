export default {
  register() { },

  async bootstrap({ strapi }: { strapi: any }) {
    const log = (msg: string) => console.log(`[AUTH-DEBUG] ${msg}`);
    log('Bootstrap script started at ' + new Date().toISOString());

    try {
      // 1. Get Super Admin role code
      // Strapi 5 uses constants for this, but 'strapi-super-admin' is the default code
      const superAdminRole = await strapi.db.query('admin::role').findOne({
        where: { code: 'strapi-super-admin' }
      });

      if (!superAdminRole) {
        log('CRITICAL: Super Admin role not found in database!');
        // Fallback: try to find any role if super-admin code is different
        const allRoles = await strapi.db.query('admin::role').findMany();
        log(`Available roles: ${allRoles.map((r: any) => r.code).join(', ')}`);
        return;
      }
      log(`Found Super Admin role with ID: ${superAdminRole.id}`);

      const email = 'berkeklc.123@gmail.com';
      const password = 'RushZanzibar2026!';

      // 2. Check if user exists
      let user = await strapi.db.query('admin::user').findOne({ where: { email } });
      const adminService = strapi.service('admin::user');

      if (user) {
        log(`User ${email} exists (ID: ${user.id}). Attempting password reset...`);
        // We use the service update to ensure password hashing
        await adminService.updateById(user.id, {
          password: password,
          isActive: true,
          registrationToken: null,
          blocked: false
        });
        log('Update command completed.');
      } else {
        log(`User ${email} does not exist. Creating new super admin...`);
        await adminService.create({
          email,
          password,
          firstname: 'Admin',
          lastname: 'Rush',
          roles: [superAdminRole.id],
          isActive: true,
          registrationToken: null
        });
        log('New user created successfully.');
      }

      // 3. Log state of other users for troubleshooting
      const allUsers = await strapi.db.query('admin::user').findMany();
      log(`Total admin users in DB: ${allUsers.length}`);
      for (const u of allUsers) {
        log(`- User: ${u.email} (ID: ${u.id}, Active: ${u.isActive})`);
      }

    } catch (error: any) {
      log('ERROR in bootstrap: ' + error.message);
      console.error(error);
    }

    log('Bootstrap script finished.');
  },
};
