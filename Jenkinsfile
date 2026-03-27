pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "todo-frontend"
        // La nueva URL pública. El /api lo rutea el Nginx al backend
        PROD_API_URL = "https://makeserver.tailc624bd.ts.net/api"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/WalterMarkerian/todo-frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build \
                    --build-arg VITE_API_URL=${env.PROD_API_URL} \
                    -t ${DOCKER_IMAGE}:latest .
                """
            }
        }

        stage('Deploy to Production') {
            steps {
                // Frenamos y quitamos el viejo
                sh "docker stop todo-frontend || true && docker rm todo-frontend || true"
                
                // IMPORTANTE: Ya no necesitamos exponer el puerto 3000 al exterior ( -p 3000:80 )
                // porque ahora Nginx (puerto 80) hablará internamente con este contenedor.
                sh """
                    docker run -d \
                    --name todo-frontend \
                    --network todo-network \
                    ${DOCKER_IMAGE}:latest
                """
            }
        }
    }

    post {
        success {
            echo "¡Frontend desplegado con éxito en ${env.PROD_API_URL.replace('/api', '')}!"
        }
        always {
            sh 'docker image prune -f'
        }
    }
}