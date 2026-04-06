pipeline {
    agent any

    options {
        // Mantenemos el disco limpio de logs viejos
        buildDiscarder(logRotator(numToKeepStr: '5'))
        disableConcurrentBuilds()
    }

    environment {
        DOCKER_IMAGE   = "todo-frontend"
        CONTAINER_NAME = "todo-frontend"
        DOCKER_NETWORK = "web_network"
        // Esta URL debe coincidir con lo que configuramos en Nginx (/api/)
        PROD_API_URL   = "/api" 
        IMAGE_TAG      = "${DOCKER_IMAGE}:${BUILD_NUMBER}"
    }

    stages {
        stage('Build Frontend Image') {
            steps {
                script {
                    // 1. Construimos con el tag del build para trazabilidad
                    // 2. Pasamos la URL de la API como build-arg para Vite
                    // 3. --pull asegura que la imagen base de Node o Nginx esté al día
                    sh """
                        docker build --pull \
                        --build-arg VITE_API_URL=${PROD_API_URL} \
                        -t ${IMAGE_TAG} .
                    """
                    
                    // 4. Tagueamos como latest para el despliegue
                    sh "docker tag ${IMAGE_TAG} ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                script {
                    // Limpieza del contenedor viejo
                    sh "docker rm -f ${CONTAINER_NAME} 2>/dev/null || true"

                    // Despliegue del nuevo contenedor
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
        success {
            echo "🚀 Frontend '${DOCKER_IMAGE}' (Build #${BUILD_NUMBER}) desplegado con éxito"
        }
        failure {
            echo "❌ Error en el despliegue del Frontend. Revisar logs del Build Stage."
        }
        always {
            script {
                // Borramos el código fuente de la carpeta workspace de Jenkins
                deleteDir()
                
                // --- LIMPIEZA DE IMÁGENES ---
                // Borramos la imagen con el tag del build (#) para no acumular
                // La imagen :latest queda protegida porque está en uso por el contenedor
                sh "docker rmi ${IMAGE_TAG} || true"
                
                // Borramos capas intermedias basura
                sh "docker image prune -f"
            }
        }
    }
}