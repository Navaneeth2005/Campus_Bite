const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: '*', // In production, specify your frontend domain
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// MySQL connection pool configuration
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campus_bite',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database connected successfully');
        console.log(`📊 Connected to database: ${process.env.DB_NAME || 'campus_bite'}`);
        connection.release();
    } catch (error) {
        console.error('❌ Error connecting to MySQL database:', error.message);
        console.error('\n⚠️  Troubleshooting steps:');
        console.error('1. Make sure MySQL is running (check XAMPP/MySQL service)');
        console.error('2. Check your .env file for correct credentials');
        console.error('3. Verify database "campus_bite" exists');
        console.error('4. Default MySQL password is usually empty or "root"\n');
    }
}

testConnection();

// Create database if not exists (run this first)
async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'campus_bite'}`);
        console.log('✅ Database checked/created successfully');
        await connection.end();
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
    }
}

// Create users table if not exists
async function createUsersTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            college VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email),
            INDEX idx_college (college)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    try {
        await pool.query(query);
        console.log('✅ Users table ready');
    } catch (error) {
        console.error('❌ Error creating users table:', error.message);
    }
}

// Initialize database
async function initializeDatabase() {
    await createDatabase();
    await createUsersTable();
}

initializeDatabase();

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized! Invalid or expired token' });
        }
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    });
};

// Routes

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        connection.release();
        res.status(200).json({ 
            status: 'OK', 
            message: 'Server is running',
            database: 'MySQL Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'ERROR', 
            message: 'Database connection failed',
            error: error.message 
        });
    }
});

// Register/Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const { fullName, email, college, password } = req.body;
        
        // Validation
        if (!fullName || !email || !college || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Trim inputs
        const trimmedFullName = fullName.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedCollege = college.trim();
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        
        // Password validation (minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        
        // Name validation
        if (trimmedFullName.length < 2) {
            return res.status(400).json({ message: 'Full name must be at least 2 characters long' });
        }
        
        // Check if user already exists
        const [existingUsers] = await connection.query(
            'SELECT id FROM users WHERE email = ?',
            [trimmedEmail]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        const [result] = await connection.query(
            'INSERT INTO users (fullname, email, college, password) VALUES (?, ?, ?, ?)',
            [trimmedFullName, trimmedEmail, trimmedCollege, hashedPassword]
        );
        
        const userId = result.insertId;
        
        // Generate JWT token
        const token = jwt.sign(
            { id: userId, email: trimmedEmail },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        console.log(`✅ New user registered: ${trimmedEmail}`);
        
        res.status(201).json({
            message: 'User registered successfully',
            token: token,
            user: {
                id: userId,
                fullName: trimmedFullName,
                email: trimmedEmail,
                college: trimmedCollege
            }
        });
        
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            message: 'Error registering user', 
            error: error.message 
        });
    } finally {
        connection.release();
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const trimmedEmail = email.trim().toLowerCase();
        
        // Find user
        const [users] = await connection.query(
            'SELECT id, fullname, email, college, password FROM users WHERE email = ?',
            [trimmedEmail]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        const user = users[0];
        
        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        console.log(`✅ User logged in: ${user.email}`);
        
        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                fullName: user.fullname,
                email: user.email,
                college: user.college
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Error logging in', 
            error: error.message 
        });
    } finally {
        connection.release();
    }
});

// Get current user (protected route)
app.get('/api/auth/me', verifyToken, async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const [users] = await connection.query(
            'SELECT id, fullname, email, college, created_at FROM users WHERE id = ?',
            [req.userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const user = users[0];
        res.status(200).json({
            user: {
                id: user.id,
                fullName: user.fullname,
                email: user.email,
                college: user.college,
                memberSince: user.created_at
            }
        });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            message: 'Error fetching user data',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Update user profile (protected route)
app.put('/api/auth/profile', verifyToken, async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const { fullName, college } = req.body;
        
        if (!fullName && !college) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        
        const updates = [];
        const values = [];
        
        if (fullName) {
            updates.push('fullname = ?');
            values.push(fullName.trim());
        }
        
        if (college) {
            updates.push('college = ?');
            values.push(college.trim());
        }
        
        values.push(req.userId);
        
        await connection.query(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
        
        const [users] = await connection.query(
            'SELECT id, fullname, email, college FROM users WHERE id = ?',
            [req.userId]
        );
        
        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: users[0].id,
                fullName: users[0].fullname,
                email: users[0].email,
                college: users[0].college
            }
        });
        
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            message: 'Error updating profile',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// Logout endpoint (client-side handles token removal)
app.post('/api/auth/logout', verifyToken, (req, res) => {
    console.log(`✅ User logged out: ${req.userEmail}`);
    res.status(200).json({ message: 'Logged out successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await pool.end();
    process.exit(0);
});
