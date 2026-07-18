# 🚀 Free Deployment Instructions

To run this project completely free without Railway costs:

## 1. Database (MySQL)
*   Sign up at **[Aiven.io](https://aiven.io/)** or **[TiDB Cloud](https://pingcap.com/products/tidb-cloud/)**.
*   Create a free MySQL instance.
*   Get the **Connection URL**, **Username**, and **Password**.

## 2. Backend (Unified Monolith)
*   Go to **[Render.com](https://render.com/)**.
*   Click **New** -> **Web Service**.
*   Connect your GitHub and select the `ecommerce-microservices` repo.
*   **Root Directory**: `unified-backend`
*   **Build Command**: `mvn clean package -DskipTests`
*   **Start Command**: `java -jar target/*.jar`
*   **Environment Variables**:
    *   `SPRING_DATASOURCE_URL`: (From Aiven)
    *   `SPRING_DATASOURCE_USERNAME`: (From Aiven)
    *   `SPRING_DATASOURCE_PASSWORD`: (From Aiven)
    *   `JWT_SECRET`: `ecommerce_jwt_super_secret_key_2024_minimum_256_bits_long`

## 3. Frontend (Vercel)
*   Go to **[Vercel](https://vercel.com/)**.
*   Import your repo.
*   **Root Directory**: `frontend`
*   **Environment Variables**:
    *   `VITE_API_BASE_URL`: (Your Render Web Service URL, e.g., `https://ecommerce-backend.onrender.com`)
    *   `PRODUCT_SERVICE_URL`: (Same as above)

---

### What I have done:
1.  **Monolith Merger**: Combined all 5 Java services into one `unified-backend` to fit in Render's free tier.
2.  **Serverless Migration**: Moved the Python AI service into Vercel Serverless Functions (saved 1 container).
3.  **Unified Config**: Updated security and routing to work without a paid API Gateway.
4.  **Vercel Optimized**: Updated `vercel.json` and added Python support to the frontend.
