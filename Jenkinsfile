pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "todo-frontend-prod"
        DOCKER_NETWORK = "web_network"
        VIRTUAL_HOST = "makeserver.tailc624bd.ts.net"
        // Ahora la API URL es RELATIVA, porque están en el mismo dominio
        PROD_API_URL = "/api" 
    }
    stages {
        stage('Build & Deploy') {
            steps {
                sh "docker build --build-arg VITE_API_URL=${PROD_API_URL} -t ${DOCKER_IMAGE}:latest ."
                sh "docker stop todo-frontend-prod || true && docker rm todo-frontend-prod || true"
                sh """
                    docker run -d \
                    --name todo-frontend-prod \
                    --network ${DOCKER_NETWORK} \
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