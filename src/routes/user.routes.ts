import express, { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BaseClass } from '../base';
import { UserDetailsInterface } from '../interface';
import { UserService } from '../services';

export class UserRoutes extends BaseClass {
  constructor(private userService : UserService){
    super();
  }
  public setupRoutes(): Router {
    const router: Router = express.Router();
  
    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Get all users
     *     tags:
     *       - Users
     *     responses:
     *       200:
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *               message: Successfully retrieved users
     *               users:
     *                 - userId: "12345"
     *                   username: "JohnDoe"
     *                   age: 30
     *                   hobby: "Reading"
     */
    router.get('/api/users', this.userService.getUsersDetails.bind(this));
  
    /**
     * @swagger
     * /api/users/{userId}:
     *   get:
     *     summary: Get user by ID
     *     tags:
     *       - Users
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         description: ID of the user to retrieve
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Successful operation
     *         content:
     *           application/json:
     *             example:
     *               userId: "12345"
     *               username: "JohnDoe"
     *               age: 30
     *               hobby: "Reading"
     *       400:
     *         description: Invalid userId format
     *       404:
     *         description: User not found
     */
    router.get('/api/users/:userId', this.userService.getUsersDetailsById.bind(this));
  
    /**
     * @swagger
     * /api/users:
     *   post:
     *     summary: Create a new user
     *     tags:
     *       - Users
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           example:
     *             username: "JohnDoe"
     *             age: 30
     *             hobby: "Reading"
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             example:
     *               userId: "12345"
     *               username: "JohnDoe"
     *               age: 30
     *               hobby: "Reading"
     *       400:
     *         description: Username, age, and hobby are required fields
     */
    router.post('/api/users', this.userService.insertUserDetails.bind(this));
  
    /**
     * @swagger
     * /api/users/{userId}:
     *   put:
     *     summary: Update user by ID
     *     tags:
     *       - Users
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         description: ID of the user to update
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           example:
     *             username: "JohnDoe"
     *             age: 30
     *             hobby: "Reading"
     *     responses:
     *       200:
     *         description: User updated successfully
     *         content:
     *           application/json:
     *             example:
     *               userId: "12345"
     *               username: "JohnDoe"
     *               age: 30
     *               hobby: "Reading"
     *       400:
     *         description: Invalid userId format or Username, age, and hobby are required fields
     *       404:
     *         description: User not found
     */
    router.put('/api/users/:userId', this.userService.updateUserDetails.bind(this));
  
    /**
     * @swagger
     * /api/users/{userId}:
     *   delete:
     *     summary: Delete user by ID
     *     tags:
     *       - Users
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         description: ID of the user to delete
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       204:
     *         description: User deleted successfully
     *       400:
     *         description: Invalid userId format
     *       404:
     *         description: User not found
     */
    router.delete('/api/users/:userId', this.userService.deleteUserDetails.bind(this));
    
     // Middleware to handle non-existing endpoints (404 errors)
     router.use((req: Request, res: Response) => {
      res.status(404).json({ message: 'Not Found' });
    });

    // Middleware to handle server-side errors (500 errors)
    router.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    });

    return router;
  }
  
}
