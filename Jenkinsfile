pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "todo-frontend"
        // Definimos la URL de producción aquí centralizada
        PROD_API_URL = "http://192.168.1.23:8090/api/v1/todos"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/WalterMarkerian/todo-frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // PASAMOS LA VARIABLE COMO BUILD-ARG
                sh """
                    docker build \
                    --build-arg VITE_API_URL=${env.PROD_API_URL} \
                    -t ${DOCKER_IMAGE}:latest .
                """
            }
        }

        stage('Deploy to Production') {
            steps {
                sh "docker stop todo-frontend || true && docker rm todo-frontend || true"
                
                // Mantenemos tu red todo-network para que se vea con el backend
                sh """
                    docker run -d \
                    --name todo-frontend \
                    -p 3000:80 \
                    --network todo-network \
                    ${DOCKER_IMAGE}:latest
                """
            }
        }
    }

    post {
        success {
            echo "¡Frontend desplegado con éxito en http://192.168.1.23:3000!"
        }
        always {
            // Limpieza de imágenes huérfanas para no llenar el disco del servidor
            sh 'docker image prune -f'
        }
    }
}