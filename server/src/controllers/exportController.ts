import { Request, Response } from "express";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import Job from "../models/JobApplication";
import { UnauthorizedError, BadRequestError } from "../utils/error";

export class ExportController {
  private requireUser(req: Request) {
    if (!req.user?.id) throw new UnauthorizedError();
    return req.user.id;
  }

  csv = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const jobs = await Job.find({ userId });
    if (!jobs?.length) {
      throw new BadRequestError(
        "There are no jobs stored for this user, first create a job to export"
      );
    }

    const fields = ["company", "jobTitle", "status", "appliedAt"];
    const parser = new Parser({ fields });
    const csv = parser.parse(jobs);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=jobs.csv");
    return res.send(csv);
  };

  pdf = async (req: Request, res: Response) => {
    const userId = this.requireUser(req);
    const jobs = await Job.find({ userId });
    if (!jobs?.length) {
      throw new BadRequestError(
        "There are no jobs stored for this user, first create a job to export"
      );
    }

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=jobs.pdf");
    doc.pipe(res);

    doc
      .fontSize(20)
      .fillColor("#333")
      .text("Job Applications Report", { align: "center" });
    doc.moveDown(2);

    const tableTop = 120;
    const rowGap = 25;
    let y = tableTop;

    doc.fontSize(12).fillColor("#000");
    doc.text("No.", 50, y);
    doc.text("Company", 100, y);
    doc.text("Job Title", 250, y);
    doc.text("Status", 400, y);
    doc.text("Applied", 500, y);
    y += rowGap;

    doc
      .moveTo(50, y - 10)
      .lineTo(550, y - 10)
      .stroke();

    jobs.forEach((job, i) => {
      doc.text(String(i + 1), 50, y);
      doc.text(job.company, 100, y);
      doc.text(job.jobTitle, 250, y);
      doc.text(job.status, 400, y);
      doc.text(job.appliedAt?.toDateString?.() ?? "", 500, y);
      y += rowGap;
    });

    doc.end();
  };
}
