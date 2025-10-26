#!/bin/bash
# Complete Database Reset - Drops ALL tables

echo "⚠️  WARNING: This will delete ALL data!"
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

psql -U postgres -d postgres << EOF

-- Drop ALL tables
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS domains CASCADE;
DROP TABLE IF EXISTS file_path_config CASCADE;
DROP TABLE IF EXISTS published_report CASCADE;
DROP TABLE IF EXISTS stored_file CASCADE;
DROP TABLE IF EXISTS subscription_request CASCADE;
DROP TABLE IF EXISTS subscription_requests CASCADE;
DROP TABLE IF EXISTS sync_job CASCADE;
DROP TABLE IF EXISTS validation_item CASCADE;

-- Show tables (should be empty)
\dt

EOF

echo "✅ All tables dropped!"
echo "🔄 Restart your Spring Boot backend to recreate tables automatically."
echo ""
echo "To restart backend:"
echo "  cd backend"
echo "  mvn spring-boot:run"
