const projectService = require("../services/project.service");

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

    const result = await projectService.getAll(options);
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
    let data;
    if(req.query?.teamId){
       data = await projectService.getByTeamId(req.params.id);
    } else {
      data = await projectService.getById(req.params.id);

    }
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
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

const mongoose = require("mongoose");

exports.create = async (req, res) => {
  try {
    let { teamId, ...rest } = req.body;
    console.log("req.body",req.body)

        if (!(teamId instanceof mongoose.Types.ObjectId)) {

    teamId = new mongoose.Types.ObjectId(teamId);
        }
    const data = await projectService.create({ ...rest, teamId });

    res.status(201).json({
      success: true,
      data,
      message: "Project created successfully",
    });
  } catch (error) {
    console.error("Error in create:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.update = async (req, res) => {
  try {
    const data = await projectService.update(req.params.id, req.body);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    res.status(200).json({
      success: true,
      data,
      message: "Project updated successfully"
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
    const result = await projectService.delete(req.params.id, force);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: force ? "Project permanently deleted" : "Project deleted successfully"
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
    const data = await projectService.restore(req.params.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    res.status(200).json({
      success: true,
      data,
      message: "Project restored successfully"
    });
  } catch (error) {
    console.error("Error in restore:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};