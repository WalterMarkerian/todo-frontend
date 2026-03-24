pipeline {
    agent any

    environment {
        // Nombre de tu imagen en Docker Hub o local
        DOCKER_IMAGE = "todo-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                // Descarga el código de GitHub
                git branch: 'main', url: 'https://github.com/WalterMarkerian/todo-frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Construye la imagen usando el Dockerfile que creamos antes
                sh "docker build -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Deploy to Production') {
            steps {
                // Detiene y borra el contenedor si ya existe
                sh "docker stop todo-frontend || true && docker rm todo-frontend || true"
                
                // Levanta el nuevo contenedor
                // Mapeamos el puerto 3000 del servidor al 80 de Nginx (definido en el Dockerfile)
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
            echo '¡Frontend desplegado con éxito en http://192.168.1.23:3000!'
        }
    }
}