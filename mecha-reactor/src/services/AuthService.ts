const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

interface UserData {
    id: string;
    username: string;
    email: string;
}

interface AuthResponse {
    user: UserData;
    token: string;
}

class AuthService {
    static async register(username: string, email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to register');
        }

        return response.json();
    }

    static async login(username: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to login');
        }

        return response.json();
    }

    static async getCurrentUser(): Promise<UserData> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get user data');
        }

        return response.json();
    }
}

export default AuthService;
