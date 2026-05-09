const router = require("express").Router();
const { getProjects, getProjectById } = require("../controllers/projectsController");

// GET /api/projects?category=AI/ML
router.get("/", getProjects);

// GET /api/projects/:id
router.get("/:id", getProjectById);

module.exports = router;
