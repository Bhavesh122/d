# Domain Management System - Setup Checklist

Complete this checklist to ensure your system is properly configured and running.

## ✅ Prerequisites Checklist

- [ ] Java 17 or higher installed
  ```bash
  java -version
  ```

- [ ] Maven 3.6+ installed
  ```bash
  mvn -version
  ```

- [ ] PostgreSQL 12+ installed
  ```bash
  psql --version
  ```

- [ ] Node.js and npm installed (for React)
  ```bash
  node -version
  npm -version
  ```

- [ ] Git installed (optional)
  ```bash
  git --version
  ```

## 🗄️ Database Setup Checklist

- [ ] PostgreSQL service is running
  ```bash
  sudo service postgresql status
  # or on Mac:
  brew services list
  ```

- [ ] Database created
  ```bash
  psql -U postgres
  CREATE DATABASE domain_management;
  \l  # List databases to verify
  \q
  ```

- [ ] Database credentials configured in `backend/src/main/resources/application.properties`
  - [ ] Username set correctly
  - [ ] Password set correctly
  - [ ] Database URL is correct

- [ ] (Optional) Sample data loaded
  ```bash
  psql -U postgres -d domain_management -f backend/database/schema.sql
  ```

## 🔧 Backend Setup Checklist

- [ ] Navigate to backend directory
  ```bash
  cd backend
  ```

- [ ] Dependencies downloaded
  ```bash
  mvn clean install
  ```

- [ ] Application builds successfully (no errors)

- [ ] Backend starts successfully
  ```bash
  mvn spring-boot:run
  ```

- [ ] Backend is accessible
  ```bash
  curl http://localhost:8080/api/domains
  ```
  Expected: JSON array (empty or with domains)

- [ ] Check backend logs for errors
  - [ ] No connection errors
  - [ ] No port conflicts
  - [ ] Database connected successfully

## ⚛️ Frontend Setup Checklist

- [ ] Navigate to project root
  ```bash
  cd /Users/bhaveshreddy/Desktop/Coding/djd/vasu
  ```

- [ ] Dependencies installed
  ```bash
  npm install
  ```

- [ ] Axios is installed (check package.json)
  ```bash
  npm list axios
  ```

- [ ] domainService.js exists
  ```bash
  ls -la src/services/domainService.js
  ```

- [ ] Frontend starts successfully
  ```bash
  npm start
  ```

- [ ] Browser opens to http://localhost:3000

- [ ] No console errors in browser developer tools

## 🔗 Integration Testing Checklist

### Admin Flow

- [ ] Login as Admin
- [ ] Navigate to "Domain Management"
- [ ] Page loads without errors
- [ ] Click "Add Domain"
- [ ] Modal opens
- [ ] Fill in domain details:
  - Name: "Test Integration"
  - Description: "Testing backend integration"
- [ ] Click "Create"
- [ ] Success notification appears
- [ ] Domain appears in table
- [ ] Verify in database:
  ```bash
  psql -U postgres -d domain_management -c "SELECT * FROM domains;"
  ```

### User Flow

- [ ] Login as User/Subscriber
- [ ] Navigate to "Request Subscription"
- [ ] Page loads without errors
- [ ] "Test Integration" domain appears in available domains
- [ ] Search functionality works
- [ ] Domain details display correctly

### Edit Flow

- [ ] As Admin, click "Edit" on a domain
- [ ] Modal opens with existing data
- [ ] Change description
- [ ] Click "Update"
- [ ] Success notification appears
- [ ] Changes reflected in table
- [ ] As User, verify updated description shows

### Delete Flow

- [ ] As Admin, click "Delete" on a domain
- [ ] Confirmation modal appears
- [ ] Click "Delete"
- [ ] Success notification appears
- [ ] Domain removed from table
- [ ] As User, verify domain no longer appears
- [ ] Verify in database:
  ```bash
  psql -U postgres -d domain_management -c "SELECT * FROM domains;"
  ```

## 🧪 API Testing Checklist

- [ ] GET all domains works
  ```bash
  curl http://localhost:8080/api/domains
  ```

- [ ] POST create domain works
  ```bash
  curl -X POST http://localhost:8080/api/domains \
    -H "Content-Type: application/json" \
    -d '{"name":"API Test","description":"Testing API"}'
  ```

- [ ] PUT update domain works (replace {id})
  ```bash
  curl -X PUT http://localhost:8080/api/domains/{id} \
    -H "Content-Type: application/json" \
    -d '{"name":"API Test Updated","description":"Updated via API"}'
  ```

- [ ] DELETE domain works (replace {id})
  ```bash
  curl -X DELETE http://localhost:8080/api/domains/{id}
  ```

- [ ] Duplicate name prevention works
  - [ ] Try creating domain with existing name
  - [ ] Verify error message returned

## 🐛 Common Issues Checklist

If something doesn't work, check:

- [ ] Both backend and frontend are running simultaneously
- [ ] No port conflicts (8080 for backend, 3000 for frontend)
- [ ] PostgreSQL is running
- [ ] Database credentials are correct
- [ ] CORS is properly configured
- [ ] No firewall blocking connections
- [ ] Browser cache cleared (Ctrl+Shift+R)
- [ ] Check browser console for errors (F12)
- [ ] Check backend logs for errors

## 📊 Verification Checklist

- [ ] Can create domains from admin panel
- [ ] Domains appear in user subscription center
- [ ] Can edit domains
- [ ] Can delete domains
- [ ] Search functionality works
- [ ] Notifications appear correctly
- [ ] Data persists after refresh
- [ ] Data persists after backend restart
- [ ] Multiple domains can be managed
- [ ] Duplicate names are prevented

## 🚀 Production Readiness Checklist

Before deploying to production:

- [ ] Change `spring.jpa.hibernate.ddl-auto` to `validate`
- [ ] Use environment variables for database credentials
- [ ] Enable HTTPS
- [ ] Add authentication/authorization
- [ ] Set up proper logging
- [ ] Configure backup strategy for database
- [ ] Set up monitoring and alerts
- [ ] Load test the API
- [ ] Security audit completed
- [ ] Documentation updated

## 📝 Notes

**Date Completed**: _______________

**Completed By**: _______________

**Issues Encountered**:
- 
- 
- 

**Resolutions**:
- 
- 
- 

**Additional Configuration**:
- 
- 
- 

---

## 🎉 Success Criteria

Your setup is complete when:

✅ Backend runs on http://localhost:8080
✅ Frontend runs on http://localhost:3000
✅ Admin can create/edit/delete domains
✅ Users can view all available domains
✅ Changes sync in real-time between admin and user views
✅ Data persists in PostgreSQL database

**Congratulations! Your Domain Management System is ready to use!** 🚀
