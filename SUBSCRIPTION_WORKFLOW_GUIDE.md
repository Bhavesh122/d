# Subscription Request Workflow - Complete Integration Guide

This guide explains the complete subscription request workflow from user request to admin approval/rejection.

## 🔄 Complete Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REQUESTS ACCESS                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
    1. User browses available domains in Subscription Center
    2. User clicks "Request Access" on desired domain
    3. User fills request reason in modal
    4. System extracts user profile information:
       - Name: Tony Stark
       - Email: tony3000@stark.com
       - Department: Engineering
       - Role: Subscriber
    5. User submits request
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND PROCESSES REQUEST                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
    6. POST /api/subscriptions
    7. Backend validates:
       - No duplicate pending requests
       - No existing approved access
    8. Creates subscription request with status "PENDING"
    9. Saves to PostgreSQL database
   10. Returns created request to frontend
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              USER SEES UPDATED STATUS                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
   11. Domain card shows "Pending Approval" badge
   12. Cancel button appears (user can cancel if needed)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│           ADMIN REVIEWS REQUEST                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
   13. Admin navigates to "Approve/Reject Subscription"
   14. GET /api/subscriptions/pending
   15. Admin sees request with:
       - User name and email
       - Requested domain
       - Request reason
       - User department and role
       - Department match indicator
   16. Admin decides to APPROVE or REJECT
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN APPROVES                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
   17. Admin clicks "Approve" button
   18. PUT /api/subscriptions/{id}/approve
   19. Backend updates status to "APPROVED"
   20. Sets reviewedDate to current timestamp
   21. Saves to database
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              USER SEES APPROVED STATUS                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
   22. User refreshes or navigates to Subscription Center
   23. Domain card shows "Access Granted" badge (green)
   24. User can now access domain resources

                        OR

┌─────────────────────────────────────────────────────────────────┐
│                  ADMIN REJECTS                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
   25. Admin clicks "Reject" button
   26. Modal opens with rejection reason options:
       - Requested domain does not match user's department
       - Insufficient business justification
       - Access not required for user's role
       - Other (custom reason)
   27. Admin selects/enters reason
   28. PUT /api/subscriptions/{id}/reject
   29. Backend updates:
       - status to "REJECTED"
       - rejectionReason to provided reason
       - reviewedDate to current timestamp
   30. Saves to database
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              USER SEES REJECTED STATUS                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
   31. User sees "Request Rejected" badge (red)
   32. Rejection reason is displayed
   33. User can submit a new request if needed
```

## 📊 Database Schema

### subscription_requests Table

```sql
CREATE TABLE subscription_requests (
    id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    domain_id VARCHAR(255) NOT NULL,
    domain_name VARCHAR(255) NOT NULL,
    request_reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_date TIMESTAMP,
    rejection_reason TEXT,
    user_department VARCHAR(255),
    user_role VARCHAR(255)
);
```

## 🔌 API Endpoints

### User Endpoints

#### Create Subscription Request
```http
POST /api/subscriptions
Content-Type: application/json

{
  "domainId": "uuid",
  "domainName": "Finance",
  "requestReason": "Need access for quarterly reports",
  "userName": "Tony Stark",
  "userEmail": "tony3000@stark.com",
  "userDepartment": "Engineering",
  "userRole": "Subscriber"
}

Response: 201 Created
{
  "id": "generated-uuid",
  "status": "PENDING",
  "requestedDate": "2025-10-25T10:00:00",
  ...
}
```

#### Get User's Requests
```http
GET /api/subscriptions/user/{email}

Response: 200 OK
[
  {
    "id": "uuid",
    "domainName": "Finance",
    "status": "PENDING",
    "requestReason": "...",
    "requestedDate": "2025-10-25T10:00:00"
  }
]
```

#### Cancel Request
```http
DELETE /api/subscriptions/{id}/cancel?userEmail={email}

Response: 200 OK
```

### Admin Endpoints

#### Get Pending Requests
```http
GET /api/subscriptions/pending

Response: 200 OK
[
  {
    "id": "uuid",
    "userName": "Tony Stark",
    "userEmail": "tony3000@stark.com",
    "domainName": "Finance",
    "requestReason": "...",
    "status": "PENDING",
    "userDepartment": "Engineering",
    "userRole": "Subscriber",
    "requestedDate": "2025-10-25T10:00:00"
  }
]
```

#### Approve Request
```http
PUT /api/subscriptions/{id}/approve

Response: 200 OK
{
  "id": "uuid",
  "status": "APPROVED",
  "reviewedDate": "2025-10-25T11:00:00"
}
```

#### Reject Request
```http
PUT /api/subscriptions/{id}/reject
Content-Type: application/json

{
  "rejectionReason": "Insufficient business justification"
}

Response: 200 OK
{
  "id": "uuid",
  "status": "REJECTED",
  "rejectionReason": "Insufficient business justification",
  "reviewedDate": "2025-10-25T11:00:00"
}
```

## 💻 Frontend Components

### User Component: SubscriptionRequestComponent

**Location**: `src/Pages/SubscriberPage/SubscriptionRequestComponent/SubscriptionRequestComponent.js`

**Key Features**:
- Fetches all available domains from backend
- Fetches user's subscription requests
- Merges data to show subscription status on each domain
- Allows user to request access with reason
- Shows pending/approved/rejected status
- Allows cancellation of pending requests
- Displays rejection reason if rejected

**User Profile** (Mock - replace with actual auth):
```javascript
const currentUser = {
    name: 'Tony Stark',
    email: 'tony3000@stark.com',
    department: 'Engineering',
    role: 'Subscriber'
};
```

### Admin Component: ApproveRejectSubscription

**Location**: `src/Pages/AdminPage/ApproveReject/ApproveRejectSubscription.js`

**Key Features**:
- Fetches pending subscription requests
- Displays user information and request details
- Shows department match indicator
- Allows approval with one click
- Allows rejection with reason selection
- Auto-suggests rejection reason if department doesn't match
- Refreshes list after approval/rejection

## 🎨 Status Display

### User View

| Status | Badge Color | Text | Actions Available |
|--------|-------------|------|-------------------|
| null | - | "Request Access" button | Request access |
| PENDING | Yellow/Warning | "Pending Approval" | Cancel request |
| APPROVED | Green/Success | "Access Granted" | None (access granted) |
| REJECTED | Red/Danger | "Request Rejected" + reason | Request again |

### Admin View

| Status | Display | Actions Available |
|--------|---------|-------------------|
| PENDING | Shows in pending list | Approve, Reject |
| APPROVED | Removed from pending list | None |
| REJECTED | Removed from pending list | None |

## 🔒 Business Rules

### Request Creation
1. ✅ User can only have ONE pending request per domain
2. ✅ User cannot request if already approved for domain
3. ✅ Request reason is required
4. ✅ User profile information is automatically extracted

### Request Cancellation
1. ✅ Only the requesting user can cancel their request
2. ✅ Only PENDING requests can be cancelled
3. ✅ Cancellation deletes the request from database

### Request Approval
1. ✅ Only PENDING requests can be approved
2. ✅ Approval sets reviewedDate
3. ✅ Approval clears any rejection reason

### Request Rejection
1. ✅ Only PENDING requests can be rejected
2. ✅ Rejection reason is required
3. ✅ Rejection sets reviewedDate
4. ✅ User can see rejection reason

## 🧪 Testing the Workflow

### Test 1: User Requests Access

1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend**:
   ```bash
   npm start
   ```

3. **As User**:
   - Navigate to "Request Subscription"
   - Find a domain (e.g., "Finance")
   - Click "Request Access"
   - Enter reason: "Need access for quarterly financial reports"
   - Click "Submit Request"
   - ✅ Should see "Pending Approval" badge

4. **Verify in Database**:
   ```sql
   SELECT * FROM subscription_requests WHERE user_email = 'tony3000@stark.com';
   ```

### Test 2: Admin Approves Request

1. **As Admin**:
   - Navigate to "Approve/Reject Subscription"
   - See the pending request from Tony Stark
   - Review request reason
   - Click "Approve"
   - ✅ Should see success notification
   - ✅ Request disappears from pending list

2. **As User**:
   - Go back to "Request Subscription"
   - ✅ Domain now shows "Access Granted" badge

3. **Verify in Database**:
   ```sql
   SELECT status, reviewed_date FROM subscription_requests 
   WHERE user_email = 'tony3000@stark.com';
   -- Should show status = 'APPROVED'
   ```

### Test 3: Admin Rejects Request

1. **As User**:
   - Request access to another domain
   - Enter reason

2. **As Admin**:
   - See new pending request
   - Click "Reject"
   - Select reason: "Insufficient business justification"
   - Click "Reject"
   - ✅ Request disappears from pending list

3. **As User**:
   - Refresh Subscription Center
   - ✅ See "Request Rejected" badge
   - ✅ See rejection reason displayed

### Test 4: User Cancels Request

1. **As User**:
   - Request access to a domain
   - See "Pending Approval" badge
   - Click cancel button (X icon)
   - ✅ Badge disappears
   - ✅ Can request again

## 🐛 Troubleshooting

### Issue: User can't submit request

**Error**: "You already have a pending request for this domain"

**Solution**: Check if user already has a pending or approved request. Cancel existing pending request first.

### Issue: Admin doesn't see pending requests

**Possible Causes**:
1. Backend not running
2. No pending requests in database
3. API endpoint error

**Solution**:
```bash
# Check backend logs
# Verify database
psql -U postgres -d postgres
SELECT * FROM subscription_requests WHERE status = 'PENDING';
```

### Issue: Status not updating after approval

**Solution**:
- Check browser console for errors
- Verify backend returned success
- Refresh the page
- Check database to confirm status changed

## 📝 User Profile Integration

Currently using mock user profile:

```javascript
const currentUser = {
    name: 'Tony Stark',
    email: 'tony3000@stark.com',
    department: 'Engineering',
    role: 'Subscriber'
};
```

### For Production:

Replace with actual authentication context:

```javascript
// Example with Auth Context
import { useAuth } from '../../../context/AuthContext';

const { user } = useAuth();
const currentUser = {
    name: user.name,
    email: user.email,
    department: user.department,
    role: user.role
};
```

## 🚀 Next Steps

1. **Add Email Notifications**:
   - Notify user when request is approved/rejected
   - Notify admin when new request is submitted

2. **Add Audit Trail**:
   - Track who approved/rejected
   - Log all status changes

3. **Add Bulk Actions**:
   - Approve multiple requests at once
   - Export pending requests to CSV

4. **Add Advanced Filtering**:
   - Filter by department
   - Filter by date range
   - Filter by domain

5. **Add Analytics Dashboard**:
   - Request approval rate
   - Average approval time
   - Most requested domains

---

**Last Updated**: October 25, 2025
**Version**: 1.0.0
