pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "todo-frontend-prod"
        DOCKER_NETWORK = "todo-network"
        // Si usas dominio real, ponlo aquí. Si usas Tailscale, déjalo vacío 
        // para que tu JS detecte la IP del servidor automáticamente.
        PROD_API_URL = "" 
    }

    stages {
        stage('Build Frontend') {
            steps {
                // Pasamos la URL de la API como argumento de construcción
                sh "docker build --build-arg VITE_API_URL=${env.PROD_API_URL} -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh "docker stop todo-frontend-prod || true && docker rm todo-frontend-prod || true"
                
                sh """
                    docker run -d \
                    --name todo-frontend-prod \
                    --network ${DOCKER_NETWORK} \
                    --restart unless-stopped \
                    -p 3000:80 \
                    ${DOCKER_IMAGE}:latest
                """
            }
        }
    }

    post {
        success { echo "🚀 Frontend de Producción desplegado en puerto 3000" }
        always { sh "docker image prune -f" }
    }
}