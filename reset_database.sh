#!/bin/bash
# Database Reset Script

echo "🗑️  Cleaning up database..."

# Drop unused/old tables
psql -U postgres -d postgres << EOF

-- Drop old/unused tables
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS file_path_config CASCADE;
DROP TABLE IF EXISTS published_report CASCADE;
DROP TABLE IF EXISTS stored_file CASCADE;
DROP TABLE IF EXISTS subscription_request CASCADE;
DROP TABLE IF EXISTS sync_job CASCADE;
DROP TABLE IF EXISTS validation_item CASCADE;

-- Clear subscription requests (keep table structure)
TRUNCATE TABLE subscription_requests CASCADE;

-- Show remaining tables
\dt

-- Show data in domains table
SELECT id, name, description FROM domains;

EOF

echo "✅ Database cleaned! Only 'domains' and 'subscription_requests' tables remain."
echo "📝 Subscription requests have been cleared."
