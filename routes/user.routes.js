import { Router } from "express";

import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();
router.post(
  "/register",
  body("email").isEmail().withMessage("email must be a vaild account"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at a strong password"), 
    body("fullName").isLength({ min: 3 }).withMessage("Full Name must be at least 3 characters long"),
    body("phoneNumber").isLength({ min: 10 }).withMessage("Phone number must be at least 10 characters long"),
    userController.createUserController
);

router.post('/login',
  body("email").isEmail().withMessage("email must be a vaild account"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password does not matched"), 
    userController.loginController
)

router.get('/profile', authUser ,userController.profileController);

router.get('/logout',authUser , userController.logoutController);

router.get('/all',authUser , userController.getAllUserController);


export default router; 