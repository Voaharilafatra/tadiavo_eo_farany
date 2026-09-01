# FastAPI backend spec for TADIAVO-EO

This document lists the endpoints needed by the current front-end.
It is organized so the frontend can be wired with minimal ambiguity.

## Authentication

### `POST /auth/login`
Login with email/password.

Request:
```json
{
  "email": "client@example.com",
  "password": "secret123"
}
```

Response:
```json
{
  "access_token": "jwt...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Client Name",
    "email": "client@example.com",
    "role": "client"
  }
}
```

### `POST /auth/logout`
Invalidate the current session/token.

### `GET /auth/me`
Return the authenticated user.

### `GET /auth/google`
Start Google OAuth flow.

### `GET /auth/google/callback`
OAuth callback endpoint.

## Users

### `GET /users/me`
Current user profile.

### `PUT /users/me`
Update profile fields.

### `PATCH /users/me/password`
Change password.

Request:
```json
{
  "old_password": "secret123",
  "new_password": "newsecret456"
}
```

### `PATCH /users/me/avatar`
Upload or update avatar.

## Services

### `GET /services`
List services.

Query filters recommended:
- `q`
- `category`
- `location`
- `min_price`
- `max_price`
- `min_rating`
- `status`
- `page`
- `limit`

### `GET /services/{service_id}`
Single service detail.

### `POST /services`
Create a service.

### `PUT /services/{service_id}`
Replace a service.

### `PATCH /services/{service_id}`
Partial update.

### `DELETE /services/{service_id}`
Delete a service.

### `GET /services/search`
Search endpoint for the search page.

Recommended query params:
- `q`
- `category`
- `location`
- `lat`
- `lng`
- `radius`

### `GET /services/nearby`
Return services near a coordinate.

Recommended query params:
- `lat`
- `lng`
- `radius`

### `GET /services/recommendations`
Personalized or popular recommendations.

### `GET /services/{service_id}/similar`
Similar services on the detail page.

## Categories

### `GET /categories`
Return service categories.

## Reviews

### `GET /services/{service_id}/reviews`
List reviews for one service.

### `POST /services/{service_id}/reviews`
Create a review.

### `PATCH /reviews/{review_id}`
Edit a review or moderation status.

### `DELETE /reviews/{review_id}`
Delete a review.

### `POST /reviews/{review_id}/reply`
Provider reply to a review.

## Favorites

### `GET /users/me/favorites`
List favorite services.

### `POST /services/{service_id}/favorite`
Add a favorite.

### `DELETE /services/{service_id}/favorite`
Remove a favorite.

## Notifications

### `GET /notifications`
List notifications for the current user.

### `PATCH /notifications/{notification_id}/read`
Mark as read.

## Dashboard

### `GET /dashboard/summary`
Overall summary for the connected user.

### `GET /dashboard/stats`
KPIs for the dashboard cards.

### `GET /dashboard/activity`
Recent activity feed.

### `GET /dashboard/charts`
Chart-ready data for dashboards.

## Messaging / contact

### `POST /contact/messages`
Contact form submission.

Request:
```json
{
  "name": "John",
  "email": "john@example.com",
  "message": "Hello"
}
```

## Uploads

### `POST /uploads`
Generic file upload endpoint.

Useful for:
- service images
- avatar images
- documents

## Optional geospatial helpers

If you want the backend to help with maps/search:

### `GET /geo/reverse`
Reverse geocoding if needed.

### `GET /geo/search`
Address or place search.

### `GET /geo/route`
Route preview between two points.

These are optional because the current frontend already uses Leaflet/OpenStreetMap for map display.

## Suggested core models

- `User`
- `Service`
- `Review`
- `Notification`
- `Favorite`
- `Category`
- `Message`
- `DashboardSummary`

## Suggested roles

- `client`
- `prestataire`
- `admin`

## Frontend integration notes

- Use JWT bearer auth for protected routes.
- Keep paginated list endpoints for services/reviews/notifications.
- Return `lat` / `lng` as numbers for map pages.
- Return `distance` when the backend computes proximity.
- Keep response shapes stable so the current front can swap from mock data to API with minimal changes.

