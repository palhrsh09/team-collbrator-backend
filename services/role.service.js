const Role = require("../models/role.model");

const createRole = async (title, status = "active") => {
  const existing = await Role.findOne({ title });
  if (existing) throw new Error("Role title must be unique");
  const role = new Role({ title, status });
  return await role.save();
};

const getAllRoles = async () => {
  return await Role.find().sort({ createdAt: -1 });
};

const getRoleById = async (id) => {
  const role = await Role.findById(id);
  if (!role) throw new Error("Role not found");
  return role;
};

const updateRole = async (id, updateData) => {
  const updated = await Role.findByIdAndUpdate(id, updateData, { new: true });
  if (!updated) throw new Error("Role not found or update failed");
  return updated;
};

const deleteRole = async (id) => {
  const deleted = await Role.findByIdAndDelete(id);
  if (!deleted) throw new Error("Role not found or already deleted");
  return deleted;
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
