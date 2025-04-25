# Dental Clinic Management System API

## API Documentation

### Authentication

#### Register User
- **POST** `/api/auth/register`
- Required fields: name, email, password, role (optional)
- Returns: JWT token

#### Login User
- **POST** `/api/auth/login`
- Required fields: email, password
- Returns: JWT token

#### Get Current User
- **GET** `/api/auth/me`
- Protected route
- Returns: User data

### Treatments

#### Get All Treatments
- **GET** `/api/treatments`
- Protected route
- Returns: Array of treatments

#### Get Single Treatment
- **GET** `/api/treatments/:id`
- Protected route
- Returns: Treatment data

#### Create Treatment
- **POST** `/api/treatments`
- Protected route (dentist/admin only)
- Required fields: patient, type, description, cost, date
- Returns: Created treatment

#### Update Treatment
- **PUT** `/api/treatments/:id`
- Protected route (dentist/admin only)
- Returns: Updated treatment

#### Delete Treatment
- **DELETE** `/api/treatments/:id`
- Protected route (dentist/admin only)
- Returns: Success message

### Invoices

#### Get All Invoices
- **GET** `/api/invoices`
- Protected route
- Returns: Array of invoices

#### Get Single Invoice
- **GET** `/api/invoices/:id`
- Protected route
- Returns: Invoice data

#### Create Invoice
- **POST** `/api/invoices`
- Protected route (admin/staff only)
- Required fields: patient, treatments, totalAmount, dueDate
- Returns: Created invoice

#### Update Invoice
- **PUT** `/api/invoices/:id`
- Protected route (admin/staff only)
- Returns: Updated invoice

#### Delete Invoice
- **DELETE** `/api/invoices/:id`
- Protected route (admin only)
- Returns: Success message

#### Add Payment
- **POST** `/api/invoices/:id/payments`
- Protected route (admin/staff only)
- Required fields: amount, method
- Returns: Updated invoice

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Rate Limiting

API is rate limited to 100 requests per 15 minutes per IP address.

## Security

- All routes are protected by JWT authentication
- Passwords are hashed using bcrypt
- XSS protection is enabled
- CORS is configured
- Security headers are set
- Data sanitization is implemented 