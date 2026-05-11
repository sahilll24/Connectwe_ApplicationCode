pipeline {
	agent any
	tools {
		nodejs "node20"
	}

	environment {
        ENV        = "dev"
        SONAR_TOKEN = credentials('sonar-token-doc')
        DOCKERHUB   = credentials('dockerhub-cred')
        DOCKER_REPO = "sahil0724"
	IMAGE_TAG = "${BUILD_NUMBER}"
	GITOPS_REPO = "https://github.com/sahilll24/Connectwe_GitOps.git"
	}

	stages{

	stage("checkout Code"){
		steps {
		checkout scm
		}
	}
	
	stage("Install Dependencies"){
		steps{
		 dir("Client/connect-gather"){
			sh "npm ci"
			}
		 dir("Server"){
			sh "npm ci"
			}
		}
	}
stage("SonarQube Analysis") {
    steps {
        withSonarQubeEnv("sonar-server") {
            sh """
                sonar-scanner \
                -Dproject.settings=sonar-project.properties \
                -Dsonar.token=$SONAR_TOKEN
            """
        }
    }
}


	stage("Quality Gate") {
		steps {
    		timeout(time: 3, unit: 'MINUTES') {
        		waitForQualityGate abortPipeline: true
    			}
		}
	}

	stage('Build Docker Images') {
            
                steps{
			dir("Client/connect-gather"){
				echo "Building Docker Image For ConnectWe Frontend"
				sh """
					docker build -t $DOCKER_REPO/connectwe-frontend:${IMAGE_TAG} . 
				"""

			}
			dir("Server"){
				echo"Building Docker Image for ConnectWe Backend"
				sh """
					docker build -t $DOCKER_REPO/connectwe-backend:${IMAGE_TAG} .
				"""
			}
		}
            
        }

	stage('Push Docker Images') {
  		steps{          
                echo " Pushing Docker Images to DockerHub"
                sh """
                echo "$DOCKERHUB_PSW" | docker login -u "$DOCKERHUB_USR" --password-stdin

                docker push $DOCKER_REPO/connectwe-frontend:${env.BUILD_NUMBER} 

                docker push $DOCKER_REPO/connectwe-backend:${env.BUILD_NUMBER}
   
                docker logout
                """
          	}
        }
	
	stage("Clone GitOps Repo") {
		 steps {
			 dir("gitops") {
				 git branch: 'main',
				 credentialsId: 'github-creds',
				 url: "${GITOPS_REPO}"
				 }
			}
	 }
	stage("Update Kubernetes Manifests") {
		 steps {
			 dir("gitops") {
				 sh """
			 sed -i 's|image: .*connectwe-frontend:.*|image: ${DOCKER_REPO}/connectwe-frontend:${IMAGE_TAG}|g' frontend/deployment.yml
			 sed -i 's|image: .*connectwe-backend:.*|image: ${DOCKER_REPO}/connectwe-backend:${IMAGE_TAG}|g' backend/deployment.yml
			 """
		 } } }
	
	stage("Push GitOps Changes") {
		steps {
			 dir("gitops") {
			withCredentials([usernamePassword( credentialsId: 'github-creds', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS' )])
				 {
					 sh """
					 git config user.email "jenkins@connectwe.com"
					 git config user.name "jenkins"
					 git add .
					 git commit -m "Updated image tags to ${IMAGE_TAG}" || true
					 git push https://${GIT_USER}:${GIT_PASS}@github.com/sahilll24/Connectwe_GitOps.git main
		 """ } 
			}
				 }
	}


} 

}
