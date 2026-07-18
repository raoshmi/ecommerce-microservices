FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy parent pom and all module poms to cache dependencies
COPY pom.xml .
COPY eureka-server/pom.xml eureka-server/
COPY config-server/pom.xml config-server/
COPY api-gateway/pom.xml api-gateway/
COPY user-service/pom.xml user-service/
COPY product-service/pom.xml product-service/
COPY inventory-service/pom.xml inventory-service/
COPY order-service/pom.xml order-service/
COPY payment-service/pom.xml payment-service/
COPY notification-service/pom.xml notification-service/
COPY cart-service/pom.xml cart-service/
COPY unified-backend/pom.xml unified-backend/

# Copy the source code for this specific module
COPY eureka-server/src eureka-server/src

# Build only this module and its dependencies
RUN mvn clean package -pl eureka-server -am -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/eureka-server/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
