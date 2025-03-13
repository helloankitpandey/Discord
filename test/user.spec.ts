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

        const user = await prisma.user.findUnique({
            where: { id: res.body.id },
        });
        expect(user).toBeDefined();
        expect(user?.email).toBe(sampleUser.email);
        expect(user?.phoneNo).toBe(sampleUser.phoneNo);
        expect(user?.name).toBe(sampleUser.name);
        expect(user?.isDeleted).toBe(false); // if soft delete
    });

    it('should not create user with missing required fields', async () => {
        const res = await request(app).post(url).send({
            name: 'Incomplete User',
        });
        expect(res.status).toBe(HttpStatusCode.BadRequest);
        expect(res.body).toHaveProperty('error');

        const users = await prisma.user.findMany();
        expect(users.length).toBe(0);
    });

    it('should not allow duplicate emails', async () => {
        await request(app).post(url).send(sampleUser);
        const res = await request(app).post(url).send(sampleUser);
        expect(res.status).toBe(HttpStatusCode.BadRequest);
        expect(res.body).toHaveProperty('error');

        const users = await prisma.user.findMany();
        expect(users.length).toBe(1);
    });

    it('should reject invalid email format', async () => {
        const res = await request(app)
            .post(url)
            .send({
                ...sampleUser,
                email: 'invalid-email',
            });
        expect(res.status).toBe(HttpStatusCode.BadRequest);
    });

    it('should reject short password', async () => {
        const res = await request(app)
            .post(url)
            .send({
                ...sampleUser,
                password: '123',
            });
        expect(res.status).toBe(HttpStatusCode.BadRequest);
    });

    // ✅ GET ALL USERS
    it('should return all users', async () => {
        await request(app).post(url).send(sampleUser);
        const res = await request(app).get(url);
        expect(res.status).toBe(HttpStatusCode.Ok);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].email).toBe(sampleUser.email);
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
        const res = await request(app).get(`${url}/non-existing-id`);
        expect(res.status).toBe(HttpStatusCode.NotFound);
    });

    // ✅ UPDATE USER
    it('should update a user', async () => {
        const created = await request(app).post(url).send(sampleUser);
        const updatedData = { ...sampleUser, name: 'Updated Name' };
        const res = await request(app)
            .put(`${url}/${created.body.id}`)
            .send(updatedData);

        expect(res.status).toBe(HttpStatusCode.Accepted);
        expect(res.body.name).toBe('Updated Name');

        const dbUser = await prisma.user.findUnique({
            where: { id: created.body.id },
        });
        expect(dbUser?.name).toBe('Updated Name');
    });

    it('should return 404 on updating non-existent user', async () => {
        const res = await request(app)
            .put(`${url}/non-existing-id`)
            .send(sampleUser);
        expect(res.status).toBe(HttpStatusCode.NotFound);
    });

    // ✅ DELETE USER
    it('should delete a user successfully', async () => {
        const created = await request(app).post(url).send(sampleUser);
        const res = await request(app).delete(`${url}/${created.body.id}`);
        expect([HttpStatusCode.Ok, HttpStatusCode.NoContent]).toContain(
            res.status
        );

        // Check if user is soft deleted or hard deleted
        const dbUser = await prisma.user.findUnique({
            where: { id: created.body.id },
        });
        if (dbUser) {
            expect(dbUser.isDeleted).toBe(true);
        } else {
            expect(dbUser).toBeNull();
        }
    });

    it('should return 404 on deleting non-existent user', async () => {
        const res = await request(app).delete(`${url}/non-existing-id`);
        expect(res.status).toBe(HttpStatusCode.NotFound);
    });

    // ✅ Clean up test check
    it('should have clean DB after test run', async () => {
        const users = await prisma.user.findMany();
        expect(users.length).toBe(0);
    });
});
