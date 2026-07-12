import { IAdmin } from "../interface/IAdmin";
import { AdminRepository } from "../repository/AdminRepository";

export class AdminService {
    private adminRepository: AdminRepository;

    constructor() {
        this.adminRepository = new AdminRepository();
    }

    async saveAdmin(admin: Partial<IAdmin>): Promise<IAdmin | null> {
        return await this.adminRepository.create(admin);
    }

    async findAdminById(id: string): Promise<IAdmin | null> {
        return await this.adminRepository.findById(id);
    }

    async findAdminByEmail(email: string): Promise<IAdmin | null> {
        return await this.adminRepository.findByEmail(email);
    }

    async updateAdmin(id: string, updatedAdmin: Partial<IAdmin>): Promise<IAdmin | null> {
        if (updatedAdmin.profileUrl === null) {
            delete updatedAdmin.profileUrl;
        }
        return await this.adminRepository.update(id, updatedAdmin);
    }

    async getAllAdmins(): Promise<IAdmin[]> {
        return await this.adminRepository.getAll();
    }

    async deleteAdmin(id: string): Promise<void> {
        await this.adminRepository.delete(id);
    }
}
