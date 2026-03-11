import Lead from "../models/leadModel.js";



// --RouteLogic: Leads closed in last 7 days.  GET /report/last-week
export const getLeadsClosedLastWeek = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const leads = await Lead.find({
            status: "Closed",
            closedAt: { $gte: sevenDaysAgo}
        }).populate("salesAgent", "name");

        const formattedLeads = leads.map((lead) => ({
          id: lead._id,
          name: lead.name,
          salesAgent: lead.salesAgent.name,
          closedAt: lead.closedAt,
        }));

        res.status(200).json(formattedLeads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// --RouteLogic: Total leads in pipeline (not closed) - GET /report/pipeline
export const getLeadsInPipeline = async (req, res)=>{
    try {
        const totalLeads = await Lead.countDocuments({
            status: { $ne: "Closed"}
        });

        res.status(200).json({ totalLeadsInPipeline: totalLeads});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// --RouteLogic: Number of leads closed per sales agent - GET /report/closed-by-agent
export const getClosedLeadsClosedByAgent = async (req, res)=>{
    try {
        const leads = await Lead.find({status: "Closed"}).populate("salesAgent", "name");

        const report = {};

        // creating an array of objects
        leads.forEach((lead)=>{
            const agentName = lead.salesAgent.name;

            if(!report[agentName]) {
                report[agentName] = 0;
            }

            report[agentName]++;
        })

        const results = Object.keys(report).map(agent => ({
            agent, totalClosed: report[agent]
        }));

        res.status(200).json(results)

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

