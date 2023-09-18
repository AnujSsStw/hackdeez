import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron("clear messages table", "0 0 */3 * *", internal.presence.clearAll);

export default crons;
