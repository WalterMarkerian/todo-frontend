pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "todo-frontend-prod"
        DOCKER_NETWORK = "web_network" // Usamos la red global del Proxy
        
        // La URL donde vive tu Frontend
        VIRTUAL_HOST = "makeserver.tailc624bd.ts.net"
        VIRTUAL_PATH = "/"
        
        // La URL de tu API (Backend) para que el Frontend la consuma
        PROD_API_URL = "https://todo-api.makeserver.tailc624bd.ts.net" 
    }

    stages {
        stage('Build Frontend') {
            steps {
                // Pasamos la URL de la API como argumento para que se inyecte en el JS
                sh "docker build --build-arg VITE_API_URL=${PROD_API_URL} -t ${DOCKER_IMAGE}:latest ."
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
                    -e VIRTUAL_HOST=${VIRTUAL_HOST} \
                    -e VIRTUAL_PORT=80 \
                    ${DOCKER_IMAGE}:latest
                """
            }
        }
    }

    post {
        success { echo "🚀 Frontend desplegado en https://${VIRTUAL_HOST}" }
        always { sh "docker image prune -f" }
    }
}