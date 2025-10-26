# Quick Start Guide - Subscription Request System

## 🚀 Start the System

### 1. Restart Backend (to load new subscription entities)

The backend is currently running but needs to be restarted to load the new subscription request entities.

```bash
# Stop the current backend (Ctrl+C in the terminal where it's running)
# Then restart:
cd /Users/bhaveshreddy/Desktop/Coding/djd/vasu/backend
mvn spring-boot:run
```

**What happens**: Spring Boot will automatically create the `subscription_requests` table in PostgreSQL.

### 2. Start Frontend (if not already running)

```bash
cd /Users/bhaveshreddy/Desktop/Coding/djd/vasu
npm start
```

## ✅ Test the Complete Workflow

### Step 1: User Requests Access

1. Open browser to `http://localhost:3000`
2. Login as **User/Subscriber**
3. Navigate to **"Request Subscription"**
4. You should see available domains (Finance, etc.)
5. Click **"Request Access"** on any domain
6. Enter a reason: *"Need access for quarterly financial reports"*
7. Click **"Submit Request"**
8. ✅ You should see:
   - Success notification
   - Domain badge changes to "Pending Approval" (yellow)
   - Cancel button (X) appears

### Step 2: Admin Reviews Request

1. Switch to **Admin** role (or open in incognito window)
2. Navigate to **"Approve/Reject Subscription"**
3. ✅ You should see:
   - The pending request from Tony Stark
   - Domain: Finance
   - Request reason displayed
   - User information (name, email, department, role)
   - Department match indicator

### Step 3: Admin Approves Request

1. Click **"Approve"** button
2. ✅ You should see:
   - Success notification
   - Request disappears from pending list
   - Pending count decreases

### Step 4: User Sees Approval

1. Switch back to **User** view
2. Navigate to **"Request Subscription"**
3. ✅ You should see:
   - Domain badge is now "Access Granted" (green)
   - No cancel button
   - Cannot request again

### Alternative: Admin Rejects Request

1. As User, request access to another domain
2. As Admin, click **"Reject"** on the request
3. Select rejection reason or enter custom reason
4. Click **"Reject"**
5. As User, refresh and see:
   - "Request Rejected" badge (red)
   - Rejection reason displayed
   - Can submit new request

## 🗄️ Verify in Database

```bash
# Connect to PostgreSQL
psql -U postgres -d postgres

# View all subscription requests
SELECT 
    user_name, 
    domain_name, 
    status, 
    request_reason,
    requested_date 
FROM subscription_requests 
ORDER BY requested_date DESC;

# View only pending requests
SELECT * FROM subscription_requests WHERE status = 'PENDING';

# Exit
\q
```

## 📊 What Was Created

### Backend Files (Java/Spring Boot)

```
backend/src/main/java/com/yourcompany/domainmanagement/
├── model/
│   └── SubscriptionRequest.java          # Entity for subscription requests
├── repository/
│   └── SubscriptionRequestRepository.java # Data access layer
├── service/
│   └── SubscriptionRequestService.java    # Business logic
├── controller/
│   └── SubscriptionRequestController.java # REST API endpoints
└── dto/
    ├── SubscriptionRequestDTO.java        # Request data transfer object
    └── ApprovalDecisionDTO.java           # Approval/rejection DTO
```

### Frontend Files (React)

```
src/
├── services/
│   └── subscriptionService.js             # API service for subscriptions
└── Pages/
    ├── SubscriberPage/
    │   └── SubscriptionRequestComponent/
    │       └── SubscriptionRequestComponent.js  # Updated with backend integration
    └── AdminPage/
        └── ApproveReject/
            └── ApproveRejectSubscription.js     # Updated with backend integration
```

### Database

```
postgres database:
├── domains table                          # Existing
└── subscription_requests table            # NEW - auto-created by Hibernate
```

## 🔌 API Endpoints Available

| Method | Endpoint | Description | User Type |
|--------|----------|-------------|-----------|
| GET | `/api/subscriptions/pending` | Get pending requests | Admin |
| GET | `/api/subscriptions/user/{email}` | Get user's requests | User |
| POST | `/api/subscriptions` | Create new request | User |
| PUT | `/api/subscriptions/{id}/approve` | Approve request | Admin |
| PUT | `/api/subscriptions/{id}/reject` | Reject request | Admin |
| DELETE | `/api/subscriptions/{id}/cancel` | Cancel request | User |

## 🎯 Key Features Implemented

### User Features
- ✅ Browse available domains
- ✅ Request access with reason
- ✅ View request status (pending/approved/rejected)
- ✅ Cancel pending requests
- ✅ See rejection reason if rejected
- ✅ User profile automatically extracted and sent

### Admin Features
- ✅ View all pending requests
- ✅ See user information (name, email, department, role)
- ✅ See request reason
- ✅ Department match indicator
- ✅ One-click approval
- ✅ Rejection with reason selection
- ✅ Auto-refresh after actions

### Backend Features
- ✅ Duplicate request prevention
- ✅ Status validation (can't approve already approved)
- ✅ User authorization (can only cancel own requests)
- ✅ Automatic timestamp tracking
- ✅ Comprehensive error handling

## 🧪 Quick Test Commands

### Test API Directly

```bash
# Get all pending requests
curl http://localhost:8080/api/subscriptions/pending

# Create a subscription request
curl -X POST http://localhost:8080/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "domainId": "63108952-1f86-44b9-8b24-5ccabaf506a9",
    "domainName": "Finance",
    "requestReason": "Need access for reports",
    "userName": "Test User",
    "userEmail": "test@example.com",
    "userDepartment": "Finance",
    "userRole": "Analyst"
  }'

# Get user's requests
curl http://localhost:8080/api/subscriptions/user/tony3000@stark.com
```

## 🐛 Common Issues

### Backend doesn't restart properly
```bash
# Kill any Java processes
pkill -f spring-boot

# Restart
cd backend
mvn spring-boot:run
```

### Table not created
- Check backend logs for Hibernate SQL statements
- Should see: `CREATE TABLE subscription_requests...`
- If not, check `application.properties` has `spring.jpa.hibernate.ddl-auto=update`

### Frontend shows errors
- Open browser console (F12)
- Check for CORS errors
- Verify backend is running on port 8080
- Check API calls in Network tab

## 📚 Documentation

- **Complete Workflow**: See `SUBSCRIPTION_WORKFLOW_GUIDE.md`
- **Backend Setup**: See `backend/README.md`
- **Integration Guide**: See `INTEGRATION_GUIDE.md`

## 🎉 Success Criteria

Your system is working correctly when:

✅ User can request domain access
✅ Request appears in admin's pending list with all user info
✅ Admin can approve → User sees "Access Granted"
✅ Admin can reject → User sees rejection reason
✅ User can cancel pending requests
✅ All data persists in PostgreSQL database
✅ No duplicate requests allowed

---

**Ready to test!** Start with Step 1 above. 🚀
