# Stage 1: Build the application
FROM maven:3.8.4-openjdk-17-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the backend source code and pom.xml
# Note: We copy from the 'fintrack' subdirectory
COPY fintrack/pom.xml ./fintrack/
COPY fintrack/src ./fintrack/src

# Build the application
WORKDIR /app/fintrack
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built jar file from the build stage
# The jar name matches your pom.xml artifactId and version
COPY --from=build /app/fintrack/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
