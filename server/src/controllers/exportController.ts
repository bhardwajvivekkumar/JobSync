import { Request, Response } from "express";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import Job from "../models/JobApplication";

// ✅ Extend Express Request to include `user`
interface AuthRequest extends Request {
  user?: { id: string };
}

export const exportCSV = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const jobs = await Job.find({ userId });

    if (!jobs || jobs.length === 0) {
      return res.status(400).json({
        message:
          "There are no jobs stored for this user, first create a job to export",
      });
    }

    const fields = ["company", "jobTitle", "status", "appliedAt"];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(jobs);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=jobs.csv");

    return res.send(csv);
  } catch (err) {
    console.error("CSV Export Error:", err);
    res.status(500).json({ error: "Server error exporting CSV" });
  }
};

export const exportPDF = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const jobs = await Job.find({ userId });

    if (!jobs || jobs.length === 0) {
      return res.status(400).json({
        message:
          "There are no jobs stored for this user, first create a job to export",
      });
    }

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=jobs.pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(20).fillColor("#333").text("Job Applications Report", {
      align: "center",
    });
    doc.moveDown(2);

    // Table headers
    const tableTop = 120;
    const itemSpacing = 25;
    let y = tableTop;

    doc.fontSize(12).fillColor("#000");
    doc.text("No.", 50, y);
    doc.text("Company", 100, y);
    doc.text("Job Title", 250, y);
    doc.text("Status", 400, y);
    doc.text("Applied", 500, y);
    y += itemSpacing;

    // Divider
    doc
      .moveTo(50, y - 10)
      .lineTo(550, y - 10)
      .stroke();

    // Table rows
    jobs.forEach((job, i) => {
      doc.text(String(i + 1), 50, y);
      doc.text(job.company, 100, y);
      doc.text(job.jobTitle, 250, y);
      doc.text(job.status, 400, y);
      doc.text(job.appliedAt.toDateString(), 500, y);
      y += itemSpacing;
    });

    doc.end();
  } catch (err) {
    console.error("PDF Export Error:", err);
    res.status(500).json({ error: "Server error exporting PDF" });
  }
};
