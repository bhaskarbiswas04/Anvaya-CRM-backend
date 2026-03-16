import Lead from "../models/leadModel.js";
import { leadsData } from "../datas/leads_data.js";

export const seedLeads = async () => {
  try {

    await Lead.insertMany(leadsData);

    console.log("30 leads seeded successfully");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
};
