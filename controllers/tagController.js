import Tag from "../models/tagModel.js";

// --RouteLogic : Get all Tags - GET /tags
export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });

    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --RouteLogic : Add tags - POST /tags
export const createTags = async (req, res) =>{
    try {
        const { name } = req.body;

        //validations
        if (!name) {
          return res.status(400).json({ error: "Tag name is required" });
        }

        const existing = await Tag.findOne({name})
        if (existing) {
          return res.status(400).json({ error: "Tag already exists" });
        }

        const tag = await Tag.create({name})

        res.status(201).json(tag)

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
