import mongoose from "mongoose"
import Comment from "../models/commentModel.js"
import Lead from "../models/leadModel.js"
import SalesAgent from "../models/agentModel.js"

// --RouteLogic : Add comment to a lead
export const addComment = async (req, res)=>{
    try {
        const leadId = req.params.id;
        const { commentText, author } = req.body;

        // Validations
        if(!mongoose.Types.ObjectId.isValid(leadId)) {
           return res.status(400).json({
             error: "Invalid Lead ID.",
           });
        }

        if (!commentText || typeof commentText !== "string") {
          return res.status(400).json({
            error: "Invalid input: 'commentText' is required.",
          });
        }

        // check : Lead exists
        const lead = await Lead.findById(leadId);

        if(!lead) {
            return res.status(404).json({error: `Lead with ID '${leadId}' not found.`});
        }

        // Find : Author/Agent by name
        const agent = await SalesAgent.findById(author);

        if(!agent) {
            return res.status(404).json({
              error: `Sales Agent not found.`,
            });
        }

        // Create Comment :  After all validations passed
        const comment = new Comment({
          lead: leadId,
          author: author, 
          commentText,
        });

        const savedComment = await comment.save();
        const populatedComment = await Comment.findById(
          savedComment._id,
        ).populate("author", "name");

        res.status(201).json({
          id: populatedComment._id,
          commentText: populatedComment.commentText,
          author: populatedComment.author.name,
          createdAt: populatedComment.createdAt,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// --RouteLogic: Get All Comments For A Lead.  GET /leads/:id/comments
export const getCommentsByLead =  async (req, res)=>{
    try {
        const leadId = req.params.id;

        //validations
        if(!mongoose.Types.ObjectId.isValid(leadId)) {
            res.status(400).json({ error: "Invalid Lead ID."});
        }

        // check: Lead exists
        const lead = await Lead.findById(leadId);
        if(!lead) {
            res.status(404).json({error: `Lead with ID '${leadId}' not found.`})
        }

        const comments = await Comment.find({ lead: leadId })
          .populate("author", "name")
          .sort({ createdAt: -1 });

        const formattedComment = comments.map(comment => ({
            id: comment._id,
            commentText: comment.commentText,
            author: comment.author.name,
            createdAt: comment.createdAt,
        }));

        res.status(200).json(formattedComment);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}