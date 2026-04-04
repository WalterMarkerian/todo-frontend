pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "todo-frontend"
        CONTAINER_NAME = "todo-frontend"
        DOCKER_NETWORK = "web_network"
        // Usamos el path base de tu API
        PROD_API_URL = "/api/v1" 
    }
    stages {
        stage('Build Image') {
            steps {
                // Pasamos la URL de la API en tiempo de compilación
                sh "docker build --build-arg VITE_API_URL=${PROD_API_URL} -t ${DOCKER_IMAGE}:latest ."
            }
        }
        stage('Deploy Frontend') {
            steps {
                script {
                    sh "docker rm -f ${CONTAINER_NAME} 2>/dev/null || true"
                    sh """
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        --network ${DOCKER_NETWORK} \
                        --restart unless-stopped \
                        ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }
    }
    post {
        success { echo "🚀 Frontend desplegado correctamente" }
        always { 
            deleteDir()
            sh "docker image prune -f" 
        }
    }
}