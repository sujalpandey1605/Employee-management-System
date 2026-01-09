# ETPMS - Employee Task Performance Management System

ETPMS is a modern, microservices-based application designed to manage workforce productivity and task lifecycles through a data-driven approach.

## 🚀 Tech Stack

### **Frontend**
- **React.js + Vite**: Fast, interactive user interface.
- **Bootstrap 5**: Responsive design and layout.
- **Lucide React**: High-quality icons.
- **Recharts**: Data visualization for performance tracking.
- **Axios**: Promised-based HTTP client for API communication.

### **Backend (Microservices)**
- **Spring Boot 3.x**: Core framework for microservices.
- **Spring Security + JWT**: Stateless authentication and role-based access control (RBAC).
- **Spring Data JPA**: Database abstraction and persistence.
- **Apache Kafka**: Event-driven communication between services.
- **MySQL**: Relational database for user and task management.

### **Infrastructure & Deployment**
- **Docker**: Containerization of all components.
- **Docker Compose**: Orchestration of services, databases, and message brokers.
- **Nginx**: Production-grade web server for serving the React frontend.

## 🏗️ Architecture Overview

The project follows a **Microservices Architecture** to ensure scalability and decoupling:

1.  **Auth Service (8081)**: Centralized identity provider managing logins, signups, and security tokens.
2.  **Task Service (8082)**: Business logic service for task creation, assignment, and status tracking.
3.  **Communication**: Uses REST for Frontend-to-Backend calls and Kafka for Backend-to-Backend asynchronous messaging.

## 👥 Role-Based Features

- **Admin**: Full control over user management and system-wide reporting.
- **Manager**: Empowered to create tasks, assign them to team members, and monitor performance analytics.
- **Employee**: Personalized dashboard to track assigned tasks and update progress with real-time remarks.

## 🛠️ Getting Started (Docker)

To run the entire ecosystem locally:
```bash
docker-compose up --build
```
Access the application at `http://localhost:5173`.
