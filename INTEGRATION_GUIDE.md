# Domain Management System - Integration Guide

Complete guide for integrating the Spring Boot backend with React frontend for domain management functionality.

## 📋 Overview

This integration allows:
- **Admin**: Add, edit, and delete domains via the Admin Dashboard
- **Users**: View available domains in the Subscription Request Center
- **Real-time sync**: Changes made by admin instantly reflect for users

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                           │
│                   (localhost:3000)                           │
│                                                              │
│  ┌──────────────────┐         ┌─────────────────────────┐  │
│  │  Admin Dashboard │         │  User Subscription      │  │
│  │  Domain Mgmt     │         │  Request Center         │  │
│  └────────┬─────────┘         └──────────┬──────────────┘  │
│           │                               │                  │
│           └───────────┬───────────────────┘                  │
│                       │                                      │
│              ┌────────▼────────┐                            │
│              │ domainService.js│                            │
│              │   (API Layer)   │                            │
│              └────────┬────────┘                            │
└───────────────────────┼─────────────────────────────────────┘
                        │ HTTP/REST
                        │ (CORS enabled)
┌───────────────────────▼─────────────────────────────────────┐
│              Spring Boot Backend                             │
│              (localhost:8080)                                │
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │ Controller   │───▶│   Service    │───▶│  Repository  │ │
│  │ (REST API)   │    │ (Business    │    │  (JPA/       │ │
│  │              │    │  Logic)      │    │  Hibernate)  │ │
│  └──────────────┘    └──────────────┘    └──────┬───────┘ │
│                                                   │          │
└───────────────────────────────────────────────────┼─────────┘
                                                    │
                                            ┌───────▼────────┐
                                            │   PostgreSQL   │
                                            │   Database     │
                                            │ (localhost:5432)│
                                            └────────────────┘
```

## 🚀 Quick Start

### Step 1: Setup PostgreSQL Database

```bash
# Start PostgreSQL service
sudo service postgresql start

# Create database
psql -U postgres
CREATE DATABASE domain_management;
\q
```

### Step 2: Configure Backend

```bash
# Navigate to backend directory
cd backend

# Update database credentials in application.properties
# Edit: src/main/resources/application.properties
# Set your PostgreSQL username and password

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend will start on: **http://localhost:8080**

### Step 3: Start React Frontend

```bash
# Navigate to project root
cd /Users/bhaveshreddy/Desktop/Coding/djd/vasu

# Install dependencies (if not already done)
npm install

# Start React app
npm start
```

Frontend will start on: **http://localhost:3000**

## 📁 Project Structure

```
vasu/
├── backend/                                    # Spring Boot Backend
│   ├── src/main/java/com/yourcompany/domainmanagement/
│   │   ├── DomainManagementApplication.java   # Main application
│   │   ├── config/
│   │   │   └── CorsConfig.java                # CORS configuration
│   │   ├── controller/
│   │   │   └── DomainController.java          # REST endpoints
│   │   ├── model/
│   │   │   └── Domain.java                    # Domain entity
│   │   ├── repository/
│   │   │   └── DomainRepository.java          # Data access
│   │   └── service/
│   │       └── DomainService.java             # Business logic
│   ├── src/main/resources/
│   │   └── application.properties             # Configuration
│   ├── database/
│   │   └── schema.sql                         # Database schema
│   ├── pom.xml                                # Maven dependencies
│   └── README.md                              # Backend documentation
│
├── src/                                        # React Frontend
│   ├── services/
│   │   └── domainService.js                   # API service layer
│   └── Pages/
│       ├── AdminPage/
│       │   └── DomainManagement/
│       │       └── DomainManagement.js        # Admin domain management
│       └── SubscriberPage/
│           └── SubscriptionRequestComponent/
│               └── SubscriptionRequestComponent.js  # User view
│
└── INTEGRATION_GUIDE.md                       # This file
```

## 🔌 API Integration Details

### Frontend Service Layer

**File**: `src/services/domainService.js`

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const domainService = {
    getAllDomains: async () => {
        const response = await axios.get(`${API_BASE_URL}/domains`);
        return response.data;
    },
    
    addDomain: async (domain) => {
        const response = await axios.post(`${API_BASE_URL}/domains`, domain);
        return response.data;
    },
    
    updateDomain: async (id, domain) => {
        const response = await axios.put(`${API_BASE_URL}/domains/${id}`, domain);
        return response.data;
    },
    
    deleteDomain: async (id) => {
        await axios.delete(`${API_BASE_URL}/domains/${id}`);
    }
};
```

### Backend REST API

**Endpoint Base**: `http://localhost:8080/api/domains`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/domains` | Fetch all domains |
| POST | `/domains` | Create new domain |
| PUT | `/domains/{id}` | Update domain |
| DELETE | `/domains/{id}` | Delete domain |

## 🔄 Data Flow

### Admin Adds Domain

```
1. Admin clicks "Add Domain" button
   ↓
2. Fills form (name, description)
   ↓
3. Clicks "Create"
   ↓
4. Frontend calls: domainService.addDomain()
   ↓
5. POST request to: /api/domains
   ↓
6. Backend validates and saves to PostgreSQL
   ↓
7. Returns created domain with ID
   ↓
8. Frontend refreshes domain list
   ↓
9. User sees updated domains immediately
```

### User Views Domains

```
1. User navigates to "Request Subscription"
   ↓
2. Component mounts, useEffect triggers
   ↓
3. Frontend calls: domainService.getAllDomains()
   ↓
4. GET request to: /api/domains
   ↓
5. Backend fetches from PostgreSQL
   ↓
6. Returns array of domains
   ↓
7. Frontend displays in subscription center
```

## 🧪 Testing the Integration

### Test 1: Add Domain (Admin)

1. Login as Admin
2. Navigate to "Domain Management"
3. Click "Add Domain"
4. Enter:
   - Name: "Test Domain"
   - Description: "This is a test"
5. Click "Create"
6. Verify success notification
7. Check domain appears in table

### Test 2: View Domain (User)

1. Login as User
2. Navigate to "Request Subscription"
3. Verify "Test Domain" appears in available domains
4. Search for "Test" - should filter correctly

### Test 3: Update Domain (Admin)

1. As Admin, click "Edit" on "Test Domain"
2. Change description to "Updated description"
3. Click "Update"
4. Verify changes saved

### Test 4: Delete Domain (Admin)

1. As Admin, click "Delete" on "Test Domain"
2. Confirm deletion
3. Verify domain removed from list
4. As User, verify domain no longer appears

### Test 5: Backend Direct Test

```bash
# Test GET all domains
curl http://localhost:8080/api/domains

# Test POST create domain
curl -X POST http://localhost:8080/api/domains \
  -H "Content-Type: application/json" \
  -d '{"name":"API Test","description":"Created via API"}'

# Test DELETE domain (replace {id} with actual ID)
curl -X DELETE http://localhost:8080/api/domains/{id}
```

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
- Verify backend is running on port 8080
- Check `CorsConfig.java` includes `http://localhost:3000`
- Restart backend after changes

### Issue 2: Connection Refused

**Error**: `Error loading domains. Please check if backend is running.`

**Solution**:
- Verify backend is running: `curl http://localhost:8080/api/domains`
- Check backend logs for errors
- Verify PostgreSQL is running

### Issue 3: Database Connection Failed

**Error**: `Connection to localhost:5432 refused`

**Solution**:
```bash
# Check PostgreSQL status
sudo service postgresql status

# Start if not running
sudo service postgresql start

# Verify credentials in application.properties
```

### Issue 4: Duplicate Domain Name

**Error**: `Domain with name 'X' already exists`

**Solution**: This is expected behavior. Domain names must be unique. Choose a different name.

### Issue 5: Port Already in Use

**Error**: `Port 8080 is already in use`

**Solution**:
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change backend port in application.properties
server.port=8081
```

## 🔒 Security Considerations

### Current Setup (Development)

- CORS allows localhost:3000
- No authentication/authorization
- Database credentials in plain text

### Production Recommendations

1. **Add Authentication**:
   - Implement JWT tokens
   - Add Spring Security
   - Protect admin endpoints

2. **Environment Variables**:
   ```properties
   spring.datasource.username=${DB_USERNAME}
   spring.datasource.password=${DB_PASSWORD}
   ```

3. **HTTPS**:
   - Use SSL certificates
   - Enable HTTPS in Spring Boot

4. **Rate Limiting**:
   - Implement API rate limiting
   - Prevent abuse

## 📊 Database Management

### Using pgAdmin

1. Open pgAdmin
2. Connect to PostgreSQL server
3. Navigate to `domain_management` database
4. View `domains` table
5. Run queries:

```sql
-- View all domains
SELECT * FROM domains ORDER BY created_date DESC;

-- Count domains
SELECT COUNT(*) FROM domains;

-- Search domains
SELECT * FROM domains WHERE name ILIKE '%finance%';
```

### Using psql

```bash
# Connect to database
psql -U postgres -d domain_management

# List all domains
SELECT * FROM domains;

# Delete all domains
TRUNCATE TABLE domains;

# Exit
\q
```

## 🚀 Next Steps

### Potential Enhancements

1. **Subscription Management**:
   - Create subscription requests table
   - Link users to domains
   - Approval workflow

2. **User Management**:
   - User authentication
   - Role-based access control
   - User profiles

3. **Audit Logging**:
   - Track who created/modified domains
   - Log all API calls
   - Compliance reporting

4. **File Management**:
   - Link files to domains
   - File upload/download
   - Version control

5. **Notifications**:
   - Email notifications
   - Real-time updates via WebSocket
   - Push notifications

## 📝 API Documentation

For detailed API documentation, see:
- Backend README: `backend/README.md`
- Swagger UI (if enabled): `http://localhost:8080/swagger-ui.html`

## 🤝 Contributing

When making changes:

1. Update backend: Modify Java files, rebuild with Maven
2. Update frontend: Modify React components, restart dev server
3. Test integration: Verify both admin and user flows
4. Update documentation: Keep this guide current

## 📞 Support

For issues or questions:
- Check troubleshooting section
- Review backend logs: `backend/logs/`
- Review browser console for frontend errors
- Check PostgreSQL logs

---

**Last Updated**: January 2025
**Version**: 1.0.0
