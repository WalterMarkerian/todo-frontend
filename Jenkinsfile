pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "todo-frontend"
        // Corregimos la URL para que apunte al puerto que expusimos en Tailscale (8443)
        PROD_API_URL = "https://makeserver.tailc624bd.ts.net:8443/api/v1"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/WalterMarkerian/todo-frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Usamos comillas dobles para que Jenkins resuelva la variable, 
                // pero envolvemos el valor en comillas simples para el comando de Docker
                sh "docker build --build-arg VITE_API_URL='${env.PROD_API_URL}' -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Deploy to Production') {
            steps {
                sh "docker stop todo-frontend || true && docker rm todo-frontend || true"
                
                // IMPORTANTE: Agregamos -p 30:80 para que Tailscale Funnel lo encuentre
                // Se usa 3000 porque es lo que configuraste en 'tailscale funnel --bg 3000'
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
            echo "¡Frontend desplegado con éxito en https://makeserver.tailc624bd.ts.net!"
        }
        always {
            sh 'docker image prune -f'
        }
    }
}