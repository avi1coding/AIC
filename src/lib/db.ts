import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export async function getPool(): Promise<mysql.Pool> {
  if (pool) {
    return pool;
  }

  const poolConfig: any = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'aic_db',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  // Add SSL support for cloud databases
  if (process.env.MYSQL_SSL === 'true') {
    poolConfig.ssl = {
      rejectUnauthorized: false
    };
  }

  pool = mysql.createPool(poolConfig);

  return pool;
}

export async function initializeDatabase(): Promise<void> {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    // Create login table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS login (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username TEXT,
        password TEXT NOT NULL
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}
