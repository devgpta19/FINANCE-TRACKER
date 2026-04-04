# Finance Tracker

Finance Tracker is a full-stack web application designed to help users track their financial records, visualize spending through dynamic dashboards, and manage categories using role-based access control.

## Project Structure
- **Frontend**: React application built with Vite, Material UI (MUI), and Chart.js. Located in the `FinFront` directory.
- **Backend**: Spring Boot application. Located in the `fintrack` directory.

## Current Setup Steps Completed
1. **Frontend Initialization**: Initialized a standard Vite + React project in the `FinFront` directory.
2. **Library Setup**: Installed MUI, ChartJS, Axios, and React Router.
3. **Theming Core**: Connected plain CSS Variables `data-theme` to the custom MUI theme for a responsive Light and Dark mode transition.
4. **Context API Core**: Rolled out React context for seamless state management across Themes and Authentication.
5. **UI Pages Integration**: Added Dashboard and Financial Record endpoints leveraging `axios` instances pointing natively to the Spring Boot REST controllers. Protected routing is established globally based on standard app tokens.

## How to Run

### Frontend
Navigate to the frontend directory and start the Vite development server:
```bash
cd FinFront
npm install
npm run dev
```

### Backend
Make sure Maven and Java are installed, then navigate to your backend directory and run:
```bash
cd fintrack
./mvnw spring-boot:run
```
*(This README will be updated continuously as the project progresses).*
