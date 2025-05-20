module.exports = {
  paymentManager: {
    task: async ({ strapi }) => {
      const tablesToCheck = ["biznes-konferencziya", "yus-ural", "faith-conf", "fire-chel", "youth-mgn"];

      for (const table of tablesToCheck) {
        try {
          console.log(`Checking table: ${table}`);
          const now = new Date();

          const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

          const pendingRecords = await strapi.db
            .query(`api::${table}.${table}`)
            .findMany({
              where: {
                status: "pending",
                createdAt: { $lt: thirtyMinutesAgo.toISOString() },
              },
            });

          console.log(pendingRecords);

          console.log(
            `Found ${pendingRecords.length} pending records in table ${table}`
          );

          for (const record of pendingRecords) {
            await strapi.db.query(`api::${table}.${table}`).delete({
              where: { id: record.id },
            });
            console.log(
              `Deleted record with ID ${record.id} from table ${table}`
            );
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
            throw new Error(`Error in cron manager. ${error.message}`);
          }
        }
      }
    },
    options: {
      rule: "0 */3 * * *",
    },
  },
};
