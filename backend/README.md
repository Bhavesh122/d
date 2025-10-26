# Domain Management Backend API

A Spring Boot REST API for managing domains in the Domain Management System. This backend integrates with PostgreSQL database and provides CRUD operations for domain entities.

## 🚀 Features

- **CRUD Operations**: Create, Read, Update, and Delete domains
- **PostgreSQL Integration**: Persistent storage with JPA/Hibernate
- **CORS Enabled**: Configured for React frontend on localhost:3000
- **RESTful API**: Clean REST endpoints following best practices
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Duplicate Prevention**: Prevents duplicate domain names

## 📋 Prerequisites

Before running this application, ensure you have:

- **Java 17** or higher installed
- **Maven 3.6+** installed
- **PostgreSQL 12+** installed and running
- **pgAdmin** (optional, for database management)

## 🛠️ Setup Instructions

### 1. Database Setup

#### Create Database in PostgreSQL

```sql
-- Connect to PostgreSQL (using psql or pgAdmin)
CREATE DATABASE domain_management;
```

#### Configure Database Connection

Edit `src/main/resources/application.properties` and update the following:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/domain_management
spring.datasource.username=YOUR_POSTGRES_USERNAME
spring.datasource.password=YOUR_POSTGRES_PASSWORD
```

**Default credentials in the file:**
- Username: `postgres`
- Password: `postgres`

### 2. Build the Project

Navigate to the backend directory and run:

```bash
cd backend
mvn clean install
```

This will:
- Download all dependencies
- Compile the project
- Run tests (if any)
- Create a JAR file in the `target` directory

### 3. Run the Application

#### Option 1: Using Maven

```bash
mvn spring-boot:run
```

#### Option 2: Using JAR file

```bash
java -jar target/domain-management-1.0.0.jar
```

The application will start on **http://localhost:8080**

### 4. Verify the Application

Once started, you should see logs indicating:
```
Started DomainManagementApplication in X.XXX seconds
```

Test the API:
```bash
curl http://localhost:8080/api/domains
```

## 📡 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/domains` | Get all domains | - |
| GET | `/domains/{id}` | Get domain by ID | - |
| POST | `/domains` | Create new domain | `{ "name": "string", "description": "string" }` |
| PUT | `/domains/{id}` | Update domain | `{ "name": "string", "description": "string" }` |
| DELETE | `/domains/{id}` | Delete domain | - |

### Example Requests

#### Create Domain
```bash
curl -X POST http://localhost:8080/api/domains \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Finance",
    "description": "Financial reports and analytics"
  }'
```

#### Get All Domains
```bash
curl http://localhost:8080/api/domains
```

#### Update Domain
```bash
curl -X PUT http://localhost:8080/api/domains/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Finance Updated",
    "description": "Updated description"
  }'
```

#### Delete Domain
```bash
curl -X DELETE http://localhost:8080/api/domains/{id}
```

## 🗄️ Database Schema

The application automatically creates the following table:

```sql
CREATE TABLE domains (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_date TIMESTAMP
);
```

## 🔧 Configuration

### Application Properties

Key configurations in `application.properties`:

```properties
# Server Port
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/domain_management
spring.datasource.username=postgres
spring.datasource.password=postgres

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:3000` (React frontend)

To add more origins, edit `CorsConfig.java`:

```java
config.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "http://localhost:3001"  // Add more origins
));
```

## 📦 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/yourcompany/domainmanagement/
│   │   │       ├── DomainManagementApplication.java
│   │   │       ├── config/
│   │   │       │   └── CorsConfig.java
│   │   │       ├── controller/
│   │   │       │   └── DomainController.java
│   │   │       ├── model/
│   │   │       │   └── Domain.java
│   │   │       ├── repository/
│   │   │       │   └── DomainRepository.java
│   │   │       └── service/
│   │   │           └── DomainService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```
Error: Port 8080 is already in use
```
**Solution:** Change the port in `application.properties`:
```properties
server.port=8081
```

#### 2. Database Connection Failed
```
Error: Connection refused
```
**Solutions:**
- Ensure PostgreSQL is running: `sudo service postgresql status`
- Verify database credentials in `application.properties`
- Check if database exists: `psql -l`

#### 3. Table Already Exists Error
```
Error: relation "domains" already exists
```
**Solution:** Change `spring.jpa.hibernate.ddl-auto` to `update` instead of `create`

#### 4. CORS Error from Frontend
```
Error: CORS policy blocked
```
**Solution:** Verify CORS configuration in `CorsConfig.java` includes your frontend URL

## 🔄 Integration with React Frontend

The React frontend should be configured to call this backend:

```javascript
// src/services/domainService.js
const API_BASE_URL = 'http://localhost:8080/api';
```

Ensure both applications are running:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

## 📝 Development Notes

### Adding New Features

1. **Add new entity**: Create in `model/` package
2. **Add repository**: Create interface extending `JpaRepository`
3. **Add service**: Create service class with business logic
4. **Add controller**: Create REST controller with endpoints

### Database Migrations

For production, consider using Flyway or Liquibase for database migrations:

```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

## 🚀 Deployment

### Production Considerations

1. **Change `ddl-auto` to `validate`**:
```properties
spring.jpa.hibernate.ddl-auto=validate
```

2. **Use environment variables for sensitive data**:
```properties
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

3. **Enable production profile**:
```bash
java -jar app.jar --spring.profiles.active=prod
```

## 📄 License

This project is part of the Domain Management System.

## 👥 Support

For issues or questions, please contact the development team.
