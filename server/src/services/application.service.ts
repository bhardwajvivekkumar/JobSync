import JobApplication from "../models/JobApplication";

export class ApplicationService {
  async create(userId: string, payload: any) {
    return JobApplication.create({ ...payload, userId });
  }

  async list(userId: string) {
    return JobApplication.find({ userId });
  }

  async getById(userId: string, id: string) {
    return JobApplication.findOne({ _id: id, userId });
  }

  async update(userId: string, id: string, update: any) {
    return JobApplication.findOneAndUpdate({ _id: id, userId }, update, {
      new: true,
    });
  }

  async delete(userId: string, id: string) {
    return JobApplication.findOneAndDelete({ _id: id, userId });
  }

  async dueFollowUps(userId: string, until: Date) {
    return JobApplication.find({
      userId,
      followUpReminder: { $lte: until },
      followUpDone: false,
    });
  }

  async count(userId: string) {
    return JobApplication.countDocuments({ userId });
  }

  async trendsByMonth(userId: string) {
    return JobApplication.aggregate([
      { $match: { userId, appliedAt: { $type: "date" } } },
      { $group: { _id: { $month: "$appliedAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
  }

  async perDay(userId: string) {
    return JobApplication.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$appliedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async byStatus(userId: string) {
    return JobApplication.aggregate([
      { $match: { userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
  }
}
