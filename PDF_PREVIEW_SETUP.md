# PDF Preview Feature - Setup Guide

## Overview
The PDF preview feature allows users to view PDF reports directly in the browser before downloading them. This document explains the complete implementation.

## Architecture

### Backend Components

#### 1. ReportController (`/backend/src/main/java/com/rwtool/controller/ReportController.java`)
Handles PDF preview requests with three main endpoints:

- **GET `/reports/{id}`** - Get report metadata (optional)
- **POST `/reports/{id}/presign`** - Generate preview URL
  - Request body: `{ userId, folder, fileName }`
  - Response: `{ url: "http://localhost:8080/reports/stream?folder=...&fileName=..." }`
  
- **GET `/reports/stream`** - Stream PDF file for inline viewing
  - Query params: `folder`, `fileName`
  - Returns PDF with `Content-Disposition: inline` header

#### 2. Security Configuration
Updated `SecurityConfig.java` and `CorsConfig.java` to:
- Allow `/reports/**` endpoints without authentication
- Enable CORS for report endpoints from `http://localhost:3000`

### Frontend Components

#### 1. reportService.js (`/src/services/reportService.js`)
Service layer for API calls:
```javascript
reportService.presignView(reportId, userId, folder, fileName)
```

#### 2. DownloadReportComponent.js
Enhanced with `handlePreviewReport` function:
- Calls `reportService.presignView()` with report details
- Sets `selectedFile` state with presigned URL
- Displays status messages for errors

#### 3. PDFViewer.js (`/src/Pages/SubscriberPage/PDFViewer/PDFViewer.js`)
Iframe-based PDF viewer with:
- Back button to return to report list
- Display name/title
- "Open in new tab" link
- Loading state
- Error handling

## Data Flow

1. User clicks "Preview Report" button
2. `handlePreviewReport(report)` is called with report object containing:
   - `id`, `title`, `fileName`, `folderPath`
3. Frontend calls `/reports/{id}/presign` with folder and fileName
4. Backend returns streaming URL: `/reports/stream?folder=X&fileName=Y`
5. PDFViewer component renders iframe with the streaming URL
6. Backend serves PDF file with inline disposition
7. Browser displays PDF in iframe

## File Structure

```
backend/
├── src/main/java/com/rwtool/
│   ├── controller/
│   │   └── ReportController.java          # NEW - PDF preview endpoints
│   └── config/
│       ├── SecurityConfig.java            # UPDATED - Allow /reports/**
│       └── CorsConfig.java                # UPDATED - CORS for /reports/**

frontend/
├── src/
│   ├── services/
│   │   └── reportService.js               # NEW - Report API service
│   └── Pages/SubscriberPage/
│       ├── DownloadReport/
│       │   └── DownloadReportComponent.js # UPDATED - Preview functionality
│       └── PDFViewer/
│           ├── PDFViewer.js               # UPDATED - Iframe-based viewer
│           └── PDFViewer.css              # UPDATED - New styles
```

## Configuration Requirements

### Backend (application.properties)
```properties
# Storage base directory (must be set)
app.storage.local.baseDir=/path/to/your/storage

# File structure should be:
# {baseDir}/reports/{folder}/{fileName}
# Example: /storage/reports/Finance/Q4_Report.pdf
```

### Frontend
No additional configuration needed. API base URL is set in `reportService.js`:
```javascript
const API_BASE_URL = "http://localhost:8080";
```

## Testing the Feature

### 1. Verify Backend Setup
```bash
cd backend
mvn spring-boot:run
```

Check that the server starts on port 8080.

### 2. Test Endpoints Manually

**Test presign endpoint:**
```bash
curl -X POST http://localhost:8080/reports/1/presign \
  -H "Content-Type: application/json" \
  -d '{"userId":"test@example.com","folder":"Finance","fileName":"report.pdf"}'
```

Expected response:
```json
{
  "url": "http://localhost:8080/reports/stream?folder=Finance&fileName=report.pdf"
}
```

**Test stream endpoint:**
```bash
curl http://localhost:8080/reports/stream?folder=Finance&fileName=report.pdf
```

Should return PDF binary data.

### 3. Verify Frontend
```bash
cd /path/to/frontend
npm start
```

1. Navigate to Download Reports page
2. Click "Preview Report" button
3. PDF should load in iframe viewer
4. Test "Back" button and "Open in new tab" link

## Troubleshooting

### PDF Not Loading
- **Check browser console** for CORS errors
- **Verify file path** in `application.properties`
- **Check file permissions** - ensure Spring Boot can read the files
- **Test stream URL directly** in browser

### CORS Errors
- Verify `CorsConfig.java` includes `/reports/**`
- Check frontend is running on `http://localhost:3000`
- Clear browser cache

### 404 Errors
- Verify `app.storage.local.baseDir` is set correctly
- Check file exists at: `{baseDir}/reports/{folder}/{fileName}`
- Verify folder and fileName are URL-encoded properly

### Iframe Not Displaying
- Some browsers block iframe loading - check browser settings
- Try "Open in new tab" option
- Check browser console for security errors

## Security Considerations

### Current Implementation (Development)
- All `/reports/**` endpoints are public (no authentication)
- CORS allows all origins in development

### Production Recommendations
1. **Add authentication** to `/reports/**` endpoints
2. **Implement access control** - verify user has permission to view file
3. **Add rate limiting** to prevent abuse
4. **Use signed URLs** with expiration times
5. **Restrict CORS** to specific domains
6. **Add audit logging** for file access
7. **Implement virus scanning** for uploaded files

## Future Enhancements

1. **Add watermarking** to PDFs
2. **Track view analytics** (who viewed what, when)
3. **Support other file types** (Excel, Word, etc.)
4. **Add download tracking**
5. **Implement caching** for frequently accessed files
6. **Add thumbnail generation**
7. **Support cloud storage** (S3, Azure Blob, etc.)

## API Reference

### POST /reports/{id}/presign
Generate a presigned URL for viewing a report.

**Request:**
```json
{
  "userId": "user@example.com",
  "folder": "Finance",
  "fileName": "Q4_Report.pdf"
}
```

**Response:**
```json
{
  "url": "http://localhost:8080/reports/stream?folder=Finance&fileName=Q4_Report.pdf"
}
```

### GET /reports/stream
Stream a PDF file for inline viewing.

**Query Parameters:**
- `folder` (required) - Folder name
- `fileName` (required) - File name

**Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `inline; filename="..."`
- Binary PDF data

## Support

For issues or questions:
1. Check this documentation
2. Review browser console logs
3. Check Spring Boot application logs
4. Verify file paths and permissions
