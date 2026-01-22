export const config = {
    port: process.env.PORT || 3000,
    supportedPostCount: 15,
    // Zwróć uwagę: brak nawiasów < >, brak spacji. Tylko login:hasło
    databaseUrl: process.env.MONGODB_URI || 
    'mongodb+srv://kacperszczudlo_db_user:KacSzczud2115**@clustertaw.pccrx26.mongodb.net/TAWKSZ?appName=ClusterTAW',
    jwtSecret: process.env.JWT_SECRET || 'dev-jwt-secret'
};