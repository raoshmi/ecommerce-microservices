# 🚀 E-Commerce Microservices Platform

A production-grade, distributed e-commerce architecture designed for high scalability, fault tolerance, and clean microservices separation.

## 🏗️ System Architecture
This project follows a **Microservices Architecture** where each domain is completely decoupled and communicates synchronously via REST/OpenFeign:

*   **API Gateway**: Single entry point using Spring Cloud Gateway with **Circuit Breaker (Resilience4j)** and JWT security.
*   **User Service**: Handles Authentication & RBAC (Role-Based Access Control).
*   **Product Service**: Managed catalog with **In-Memory Caching** for sub-millisecond lookups.
*   **Cart Service**: High-performance cart management.
*   **Inventory Service**: Manages stock levels and product availability.
*   **Order Service**: Orchestrates orders and coordinates payments via **Razorpay**.
*   **Payment Service**: Processes payment status and records transactions.
*   **Notification Service**: Triggers transactional notifications.

## 🌟 Core Engineering Features
- ⚡ **In-Memory Caching**: Performance boost using local caching for frequently accessed product data.
- 🛡️ **Resilience Patterns**: Implemented Circuit Breakers and Fallbacks to prevent cascading failures.
- 💳 **Payment Gateway**: Integrated Razorpay for secure end-to-end transactions.
- 🔐 **JWT Security**: Secure stateless authentication across all microservices.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Modern Vanilla CSS.
- **Backend**: Spring Boot 3.2, Java 17.
- **Database**: PostgreSQL (Independent per service).
- **Documentation**: Swagger/OpenAPI.
- **DevOps**: Git & GitHub, GitHub Actions.

## 🚀 Running Standalone Backend Monolith (Port 8080)
If you want to run the simplified **Modular Monolith** architecture (running all modules in a single Spring Boot application on port `8080`):

### 1. Database Setup
Ensure PostgreSQL is running locally on port `5432` with username `postgres` and password `180904`.
Create the following database:
* `ecommerce_monolith_db`

### 2. Start the Monolith Backend:
* Run the **`UnifiedApplication`** class directly from IntelliJ.
* Alternatively, run the batch file **`RUN_BACKEND_MONOLITH.bat`** in the project root.

---

## 🚀 Running Microservices Locally (IntelliJ IDEA)
To run the full **Microservices Architecture** (starting separate Spring Boot services on different ports):

### 1. Database Setup (PostgreSQL)
Ensure PostgreSQL is running locally on port `5432` with username `postgres` and password `180904`.
Create the following databases:
* `user_db`
* `product_db`
* `inventory_db`
* `order_db`
* `payment_db`
* `cart_db`

### 2. Start the Backend Services in Order:
Run each application class directly from IntelliJ:
1. **ConfigServerApplication** (Port `8888`)
2. **EurekaServerApplication** (Port `8761`)
3. **ApiGatewayApplication** (Port `8080`)
4. **UserServiceApplication** (Port `8081`)
5. **ProductServiceApplication** (Port `8082`)
6. **InventoryServiceApplication** (Port `8085`)
7. **CartServiceApplication** (Port `8083`)
8. **OrderServiceApplication** (Port `8084`)
9. **PaymentServiceApplication** (Port `8086`)
10. **NotificationServiceApplication** (Port `8087`)

---

### 3. Start Frontend:
```bash
cd frontend
npm install
npm run dev
```

---
*Created for E-commerce Microservices & Monolith Project. Demonstrates Enterprise-level software engineering.*
