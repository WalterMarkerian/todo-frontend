pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "todo-frontend"
        // Dejamos esto vacío para que el frontend use la lógica dinámica de hostname.
        // Si algún día usas un dominio real, ponés acá "https://tu-dominio.com/api/v1"
        PROD_API_URL = "" 
        DOCKER_NETWORK = "todo-network"
    }

    stages {
        stage('Preparar Entorno') {
            steps {
                // Crea la red si no existe para que el backend y frontend se hablen
                sh "docker network create ${DOCKER_NETWORK} || true"
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/WalterMarkerian/todo-frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Inyectamos la variable VITE_API_URL en el build de Vite
                sh """
                    docker build \
                    --build-arg VITE_API_URL='${env.PROD_API_URL}' \
                    -t ${DOCKER_IMAGE}:latest .
                """
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    // Detenemos y eliminamos el contenedor viejo
                    sh "docker stop todo-frontend || true"
                    sh "docker rm todo-frontend || true"
                    
                    // Levantamos el nuevo
                    // -p 3000:80 mapea el puerto 80 del contenedor al 3000 del host para Tailscale
                    // --restart unless-stopped asegura que si el servidor se reinicia, la app suba sola
                    sh """
                        docker run -d \
                        --name todo-frontend \
                        --restart unless-stopped \
                        -p 3000:80 \
                        --network ${DOCKER_NETWORK} \
                        ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Frontend desplegado con éxito."
            echo "🔗 Acceso vía Tailscale: https://makeserver.tailc624bd.ts.net"
        }
        failure {
            echo "❌ Falló el despliegue. Revisar los logs de la etapa anterior."
        }
        always {
            // Limpia imágenes huérfanas para no llenar el disco del server
            sh 'docker image prune -f'
        }
    }
}