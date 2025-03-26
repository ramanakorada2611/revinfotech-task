const cron = require("node-cron");
const Blog = require("../models/Blog");
const { logger } = require("./logger");

const setupCronJobs = () => {
  // Run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const result = await Blog.deleteMany({
        createdAt: { $lt: oneYearAgo },
      });

      logger.info(`Deleted ${result.deletedCount} blogs older than one year`);
    } catch (error) {
      logger.error("Cron job error:", error);
    }
  });

  // setTimeout(async () => {
  //   try {
  //     const oneYearAgo = new Date();
  //     oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  //     console.log("oneYearAgo", oneYearAgo);

  //     const result = await Blog.deleteMany({
  //       createdAt: { $lt: oneYearAgo },
  //     });

  //     logger.info(`Deleted ${result.deletedCount} blogs older than one year`);
  //   } catch (error) {
  //     logger.error("Error during testing:", error);
  //   }
  // }, 5000); //
};

module.exports = { setupCronJobs };
