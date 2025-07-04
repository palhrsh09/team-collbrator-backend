const roleService = require("../services/role.service.js");

const create = async (req, res) => {
  try {
    const { title, status } = req.body;
    const role = await roleService.createRole(title, status);
    res.status(201).json({ message: "Role created", role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAll = async (_req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.status(200).json({ roles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    res.status(200).json({ role });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    res.status(200).json({ message: "Role updated", role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const role = await roleService.deleteRole(req.params.id);
    res.status(200).json({ message: "Role deleted", role });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = { create, getAll, getById, update, remove };
