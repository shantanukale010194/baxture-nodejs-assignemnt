import { BaseClass } from "../base";
import express, { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { UserDetailsInterface } from "../interface";

export class UserService extends BaseClass {

  /**
   * Get all user details Service
   * @param req 
   * @param res 
   */
  public async getUsersDetails(req: Request, res: Response) {
    try {
      res.status(200).json(this.database.getUsers());
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  /**
   * Get all user details by id service
   * @param req 
   * @param res 
   * @returns 
   */
  public async getUsersDetailsById(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      if (!this.isValidUUID(userId)) {
        return res.status(400).json({ message: "Invalid userId format" });
      }

      const user = this.database.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  /**
   * Insert user details service
   * @param req 
   * @param res 
   * @returns 
   */
  public async insertUserDetails(req: Request, res: Response) {
    try {
      const { username, age, hobby } = req.body;
      if (!username || !age || !hobby) {
        return res
          .status(400)
          .json({ message: "Username, age and hobby are required fields" });
      }
      const newUser: UserDetailsInterface = {
        userId: uuidv4(),
        username,
        age,
        hobby,
      };
      this.database.createUser(newUser);

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
 
  /**
   * Update user details service
   * @param req 
   * @param res 
   * @returns 
   */
  public async updateUserDetails(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      if (!this.isValidUUID(userId)) {
        return res.status(400).json({ message: "Invalid userId format" });
      }

      const userIndex = this.database.getUserById(userId);

      if (!userIndex) {
        return res.status(404).json({ message: "User not found" });
      }

      const { username, age, hobby } = req.body;

      if (!username || !age || !hobby) {
        return res
          .status(400)
          .json({ message: "Username, age and hobby are required fields" });
      }

      const updateUserResponse = this.database.updateUser({
        userId: userId,
        username: username,
        age: age,
        hobby: hobby,
      });

      res.status(200).json(updateUserResponse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
 
  /**
   * Delete user details service
   * @param req 
   * @param res 
   * @returns 
   */
  public async deleteUserDetails(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      if (!this.isValidUUID(userId)) {
        return res.status(400).json({ message: "Invalid userId format" });
      }
      const userIndex = this.database.getUserById(userId);

      if (!userIndex) {
        return res.status(404).json({ message: "User not found" });
      }

      const deleteUserResponse = this.database.deleteUser(userId);

      res.status(204).send(deleteUserResponse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
