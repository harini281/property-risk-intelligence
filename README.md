# Property Risk Intelligence

This project is a full-stack property risk dashboard with a clear separation between the frontend and the backend.

## 1. Project structure

### Frontend
Location: the [frontend/](frontend) directory

Responsibilities:
- Deliver the UI for dashboards, property search, property details, weather, storms, AI predictions, reports, and settings.
- Use React + TypeScript + Vite for the user experience.
- Consume backend APIs through a dedicated service layer in [frontend/src/services/api.ts](frontend/src/services/api.ts).
- Keep page-level logic separated from reusable UI components in [frontend/src/components](frontend/src/components).

Main frontend folders:
- [frontend/src/pages](frontend/src/pages) — route pages for each feature area.
- [frontend/src/components](frontend/src/components) — shared UI building blocks.
- [frontend/src/context](frontend/src/context) — authentication and shared state.
- [frontend/src/data](frontend/src/data) — mock/demo data used by the UI.
- [frontend/src/services](frontend/src/services) — API communication with the backend.
- [frontend/src/types](frontend/src/types) — shared TypeScript response types.

### Backend
Location: [backend/](backend)

Responsibilities:
- Expose REST APIs for property-risk analysis.
- Coordinate risk-related services and agents.
- Return structured risk responses to the frontend.
- Provide a clean API boundary that can later be replaced by real external weather/flood/air-quality providers.

Main backend folders:
- [backend/src/main/java/com/propertyrisk/controller](backend/src/main/java/com/propertyrisk/controller) — REST endpoints.
- [backend/src/main/java/com/propertyrisk/service](backend/src/main/java/com/propertyrisk/service) — business logic services.
- [backend/src/main/java/com/propertyrisk/agents](backend/src/main/java/com/propertyrisk/agents) — domain-specific agents.
- [backend/src/main/java/com/propertyrisk/client](backend/src/main/java/com/propertyrisk/client) — external API clients.
- [backend/src/main/java/com/propertyrisk/config](backend/src/main/java/com/propertyrisk/config) — configuration and CORS setup.

## 2. Current architecture

### Frontend flow
1. The user opens the app in the browser.
2. React routes render the correct pages under [frontend/src/pages](frontend/src/pages).
3. The UI loads data from the backend through [frontend/src/services/api.ts](frontend/src/services/api.ts).
4. The dashboard and other screens display the returned risk information.

### Backend flow
1. The Spring Boot backend receives requests from the frontend.
2. Controllers in [backend/src/main/java/com/propertyrisk/controller](backend/src/main/java/com/propertyrisk/controller) receive the API calls.
3. Services and agents process the request and build a risk report.
4. The response is returned to the frontend as JSON.

## 3. What has been improved so far

- Separated frontend and backend responsibilities more clearly.
- Added a dedicated frontend API layer so UI code is not mixed directly with networking logic.
- Added backend health and property-risk endpoints for a clearer integration boundary.
- Added CORS support so the local Vite frontend can talk to the Spring Boot backend.
- Removed repeated route-loading logic by consolidating the auth route handling in [frontend/src/App.tsx](frontend/src/App.tsx).
- Added clearer local documentation so the project is easier to understand and extend.

## 4. How to run locally

### Backend
Run from the backend folder:
- cd backend
- ./mvnw spring-boot:run

### Frontend
Run from the frontend folder:
- cd frontend
- npm install
- npm run dev

### Default local URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## 5. Main API endpoints

- GET /api/health — checks whether the backend is running.
- GET /api/property-risk?latitude=...&longitude=... — returns a risk report for a given location.

## 6. Notes for future development

- The backend is structured so external weather, flood, and air-quality providers can be connected later without changing the main controller flow.
- The frontend is structured so new dashboards or pages can be added without mixing business logic into the UI layer.
- The current UI still uses mock/demo data for some screens, but the backend integration point is now in place.
