import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

// crated user
export const createUser = async(req: any, res: any) => {
    try {
        const {name, password, email, phoneNo , bio, blocked, status} = req.body;
        const user = await prisma.user.create({
            // @ts-ignore
            data: {name, password, email, phoneNo, bio, blocked, status}
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

// get All user
export const getAllUser = async(req: any, res: any) => {
    console.log("radhe radhe");
    // console.log("Headers:", req.headers); // Debug headers

    
    try {
        // console.log('Incoming request:', req.method, req.url, req.headers);
        const user = await prisma.user.findMany();
        console.log('Users fetched:', user.length);
        console.log(user);
        
        res.json(user)
    } catch (error) {
        console.log(error);
        console.error("Error fetching users:", error);

        
        res.status(500).json({
            error: error.message
        })   
    }
}

// get single user by ID
export const getSingleUser = async(req: any, res: any) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: {id }});
        if(!user) return res.status(404).json({ message: "User not found"});
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

// updated user by their id
export const updateUser = async(req: any, res: any) => {
    try {
        const { id } = req.params;
        const { name, password, email, phoneNo, bio, blocked, status } = req.body;
        const user = await prisma.user.update({
            where: { id },
            data: { name, password, email,  phoneNo, bio, blocked, status}
        });
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

// deleteUser by id
export const deleteUser = async(req: any, res: any) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id }});
        res.json({
            message: "User deleted Succesfully"
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}