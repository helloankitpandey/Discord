import { PrismaClient } from '@prisma/client';
import { app } from '../src/app';
import request from 'supertest';
import { HttpStatusCode } from '../src/enum/http.enum';
import {
    describe,
    it,
    expect,
    beforeAll,
    beforeEach,
    afterEach,
    afterAll,
} from 'bun:test';

describe('User API', () => {
    let prisma: PrismaClient;
    const url = '/api/v1/user';
    const sampleUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '12345667889',
        phoneNo: '0123456789',
        bio: 'This is a bio',
    };

    beforeAll(async () => {
        prisma = new PrismaClient();
    });

    beforeEach(async () => {
        await prisma.user.deleteMany();
    });

    afterEach(async () => {
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    // ✅ CREATE USER
    it('should create a user successfully', async () => {
        const res = await request(app).post(url).send(sampleUser);
        expect(res.status).toBe(HttpStatusCode.Created);
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(sampleUser.email);
    });

    it('should not create user with missing required fields', async () => {
        const res = await request(app).post(url).send({
            name: 'Incomplete User',
        });
        expect(res.status).toBe(HttpStatusCode.BadRequest);
        expect(res.body).toHaveProperty('error');
    });

    it('should not allow duplicate emails', async () => {
        await request(app).post(url).send(sampleUser);
        const res = await request(app).post(url).send(sampleUser);
        expect(res.status).toBe(HttpStatusCode.BadRequest); // if duplicate email check exists
        expect(res.body).toHaveProperty('error');
    });

    // ✅ GET ALL USERS
    it('should return all users', async () => {
        await request(app).post(url).send(sampleUser);
        const res = await request(app).get(url);
        expect(res.status).toBe(HttpStatusCode.Ok);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    // ✅ GET USER BY ID
    it('should get a single user by ID', async () => {
        const created = await request(app).post(url).send(sampleUser);
        const res = await request(app).get(`${url}/${created.body.id}`);
        expect(res.status).toBe(HttpStatusCode.Ok);
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(sampleUser.email);
    });

    it('should return 404 for non-existent user ID', async () => {
        const res = await request(app).get(`${url}/99999999`);
        expect(res.status).toBe(HttpStatusCode.NotFound);
    });

    // ✅ UPDATE USER
    it('should update a user', async () => {
        const created = await request(app).post(url).send(sampleUser);
        const updatedData = { ...sampleUser, name: 'Updated Name' };
        const res = await request(app)
            .put(`/api/v1/user/${created.body.id}`)
            .send(updatedData);
        expect(res.status).toBe(HttpStatusCode.Accepted);
        expect(res.body.name).toBe('Updated Name');
    });

    it('should return 404 on updating non-existent user', async () => {
        const res = await request(app).put(`${url}/99999999`).send(sampleUser);
        expect(res.status).toBe(HttpStatusCode.NotFound);
    });

    // ✅ DELETE USER
    it('should delete a user successfully', async () => {
        const created = await request(app).post(url).send(sampleUser);
        const res = await request(app).delete(`${url}/${created.body.id}`);
        expect([HttpStatusCode.Ok, HttpStatusCode.NoContent]).toContain(
            res.status
        );
    });

    it('should return 404 on deleting non-existent user', async () => {
        const res = await request(app).delete(`${url}/99999999`);
        expect(res.status).toBe(HttpStatusCode.NotFound);
    });
});
