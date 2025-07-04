const Message = require("../models/message.model");

class MessageService {
  async getAll(options) {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      search = "",
      includeDeleted = false
    } = options;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ]
      };
    }

    // Handle soft delete
    if (!includeDeleted) {
      query.deletedAt = { $exists: false };
    }

    const [data, total] = await Promise.all([
      Message.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  async getById(id) {
    return await Message.findById(id).lean();
  }

  async create(data) {
    const message = new Message(data);
    return await message.save();
  }

  async update(id, data) {
    return await Message.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }

  async delete(id, force = false) {
    if (force) {
      return await Message.findByIdAndDelete(id);
    } else {
      return await Message.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
    }
  }

  async restore(id) {
    return await Message.findByIdAndUpdate(
      id,
      { $unset: { deletedAt: 1 } },
      { new: true }
    );
  }
}

module.exports = new MessageService();