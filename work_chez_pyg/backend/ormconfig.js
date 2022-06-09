module.exports = {
	"type": "postgres",
	"host": "localhost",
	"port": "5432",
	"username": process.env.username,
	"password": process.env.password,
	"database": process.env.database,
	"entities": ["dist/**/*.entity{ .ts,.js}"],
	"synchronize": true
}
