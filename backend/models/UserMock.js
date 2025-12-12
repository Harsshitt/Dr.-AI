
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../data/users.json');

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

class UserMock {
    constructor(data) {
        this._id = data._id || Date.now().toString();
        this.name = data.name;
        this.email = data.email;
        this.passwordHash = data.passwordHash;
        this.dob = data.dob;
        this.sex = data.sex;
        this.createdAt = data.createdAt || new Date();
        this.usage = data.usage || { reportCount: 0, fileCount: 0, lastReset: new Date() };
    }

    static async findOne(query) {
        const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const user = users.find(u => u.email === query.email);
        return user ? new UserMock(user) : null;
    }

    static async findById(id) {
        const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const user = users.find(u => u._id === id);
        return user ? new UserMock(user) : null;
    }

    static async create(userData) {
        const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const newUser = new UserMock(userData);
        users.push(newUser);
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
        return newUser;
    }

    async save() {
        const users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        const index = users.findIndex(u => u._id === this._id);
        if (index !== -1) {
            users[index] = this;
            fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
        }
    }
}

export default UserMock;
