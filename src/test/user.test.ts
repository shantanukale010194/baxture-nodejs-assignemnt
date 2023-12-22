import request from 'supertest';
import app from '../index'; // Import your Express app instance

describe('API Tests', () => {
  let createdUserId: string;

  it('should get all records with a GET api/users request (an empty array is expected)', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should create a new object by a POST api/users request (a response containing newly created record is expected)', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const response = await request(app).post('/api/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
    createdUserId = response.body.userId; // Save the created user ID for future tests
  });

  it('should get the created record by its id with a GET api/user/{userId} request (the created record is expected)', async () => {
    const response = await request(app).get(`/api/users/${createdUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(createdUserId);
  });

  it('should update the created record with a PUT api/users/{userId} request (a response is expected containing an updated object with the same id)', async () => {
    const updatedUser = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    const response = await request(app).put(`/api/users/${createdUserId}`).send(updatedUser);
    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(createdUserId);
    expect(response.body.name).toBe(updatedUser.name);
    expect(response.body.email).toBe(updatedUser.email);
  });

  it('should delete the created object by id with a DELETE api/users/{userId} request (confirmation of successful deletion is expected)', async () => {
    const response = await request(app).delete(`/api/users/${createdUserId}`);
    expect(response.status).toBe(204);
  });

  it('should get a deleted object by id with a GET api/users/{userId} request (expected answer is that there is no such object)', async () => {
    const response = await request(app).get(`/api/users/${createdUserId}`);
    expect(response.status).toBe(404);
  });
});
