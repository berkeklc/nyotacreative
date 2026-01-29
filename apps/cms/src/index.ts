export default {
  register() { },

  async bootstrap({ strapi }: { strapi: any }) {
    // Run the recovery in the background after a short delay
    setTimeout(async () => {
      const log = (msg: string) => console.log(`[AUTH-DEBUG] ${msg}`);
      try {
        const email = 'berkeklc.123@gmail.com';
        const password = 'RushZanzibar2026!';

        // Use db query which is more stable during bootstrap
        const user = await strapi.db.query('admin::user').findOne({ where: { email } });

        if (user) {
          log(`User found. Updating password...`);
          const adminService = strapi.service('admin::user');
          if (adminService) {
            await adminService.updateById(user.id, {
              password,
              isActive: true,
              blocked: false
            });
            log('Password updated successfully.');
          }
        } else {
          // Basic fallback creation if user absolutely missing
          log('User not found in background check.');
        }
      } catch (err: any) {
        console.error('[AUTH-DEBUG] Error:', err.message);
      }
    }, 5000);
  },
};
