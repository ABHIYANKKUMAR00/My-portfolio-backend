const { developer } = require("../data/portfolioData");

function getProjects(req, res) {
  const { category } = req.query;

  let projects = developer.projects;

  if (category) {
    projects = projects.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.json({
    total: projects.length,
    projects,
  });
}

function getProjectById(req, res) {
  const id = parseInt(req.params.id);
  const project = developer.projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  res.json(project);
}

module.exports = { getProjects, getProjectById };
