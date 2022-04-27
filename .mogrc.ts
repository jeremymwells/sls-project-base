
export default {
    language: 'ts',
    migrationsDir: './src/db/migrations',
    migrationsTable: process.env.MIGRATIONS_TABLE || 'migrations',
    awsConfig: {
        profile: process.env.AWS_PROFILE || 'projectbase-nonprod'
    },
    user: () => process.env.GITHUB_ACTOR || require('os').userInfo().username || 'unknown'
}