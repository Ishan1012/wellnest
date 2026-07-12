import bcrypt from "bcrypt";
import Admin from "../model/Admin";

export const seedAdmin = async (): Promise<void> => {
    try {
        const email = process.env.ADMIN_EMAIL || "admin@wellnest.com";
        const password = process.env.ADMIN_PASSWORD || "Admin@123";

        const existingAdmin = await Admin.findOne({ email });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const admin = new Admin({
                name: "System Admin",
                email,
                password: hashedPassword,
                profileUrl: "/images/user-default.png"
            });
            await admin.save();
            console.log(`Admin user seeded successfully with email: ${email}`);
        } else {
            console.log("Admin user already exists.");
        }
    } catch (error) {
        console.error("Error seeding Admin user: ", error);
    }
};
