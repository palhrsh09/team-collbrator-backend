const messageService = require("../services/message.service");

exports.getAll = async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || "createdAt",
      sortOrder: req.query.sortOrder || "desc",
      search: req.query.search || "",
      includeDeleted: req.query.includeDeleted === "true",
    };

    const result = await messageService.getAll(options);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Error in getAll:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await messageService.getById(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Error in getById:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await messageService.create(req.body);
    res.status(201).json({
      success: true,
      data,
      message: "Message created successfully"
    });
  } catch (error) {
    console.error("Error in create:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await messageService.update(req.params.id, req.body);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }
    res.status(200).json({
      success: true,
      data,
      message: "Message updated successfully"
    });
  } catch (error) {
    console.error("Error in update:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const force = req.query.force === "true";
    const result = await messageService.delete(req.params.id, force);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: force ? "Message permanently deleted" : "Message deleted successfully"
    });
  } catch (error) {
    console.error("Error in delete:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.restore = async (req, res) => {
  try {
    const data = await messageService.restore(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }
    res.status(200).json({
      success: true,
      data,
      message: "Message restored successfully"
    });
  } catch (error) {
    console.error("Error in restore:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};