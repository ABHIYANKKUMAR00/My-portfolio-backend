const path = require("path");
const fs = require("fs");

const RESUME_PATH = path.join(__dirname, "../../resumes/abhiyank_resume.pdf");

function getResume(req, res) {
  if (!fs.existsSync(RESUME_PATH)) {
    return res.status(404).json({
      error: "Resume not available yet.",
      hint: "Place 'abhiyank_resume.pdf' in the /resumes folder.",
    });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'inline; filename="Abhiyank_Gujjar_Resume.pdf"');
  res.sendFile(RESUME_PATH);
}

module.exports = { getResume };
