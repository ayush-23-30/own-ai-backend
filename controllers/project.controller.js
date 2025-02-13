// import projectModal from '../modals/project.model.js'
import * as projectService from "../services/project.services.js";
import userModel from "../modals/user.modal.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Project from "../modals/project.model.js";

export const createProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    const loggedInUser = await userModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;

    const newProject = await projectService.createProject({ name, userId });

    res.status(201).json(newProject);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

export const getAllProject = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({
      email: req.user.email,
    });

    const allUserProjects = await projectService.getAllProjectByUserId({
      userId: loggedInUser._id,
    });

    return res.status(200).json({
      projects: allUserProjects,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body;

    const loggedInUser = await userModel.findOne({
      email: req.user.email,
    });

    const project = await projectService.addUsersToProject({
      projectId,
      users,
      userId: loggedInUser._id,
    });

    return res.status(200).json({
      project,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};


export const getProjectByIdController = async (req, res) => {
  const { projectId } = req.params;


  try {
    // Validate projectId existence
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    // Validate projectId format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid Project ID format" });
    }

    // Fetch project by ID and populate users
    const project = await Project.findById(projectId).populate("users");

    // If project is not found
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Return the project
    return res.status(200).json({ project });
  } catch (error) {
    console.error("Error in getProjectByIdController:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateFileTree = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  try {

      const { projectId, fileTree } = req.body;

      const project = await projectService.updateFileTree({
          projectId,
          fileTree
      })

      return res.status(200).json({
          project
      })

  } catch (err) {
      console.log(err)
      res.status(400).json({ error: err.message })
  }
}