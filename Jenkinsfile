pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Verify Tools') {
            steps {
                bat 'java -version'
                bat 'git --version'
                bat 'node --version'
                bat 'npm --version'
                bat 'docker version'
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend/identity-service') {
                    bat 'mvnw.cmd clean test'
                }

                dir('backend/assistance-service') {
                    bat 'mvnw.cmd clean test'
                }

                dir('backend/contribution-service') {
                    bat 'mvnw.cmd clean test'
                }

                dir('backend/coordination-service') {
                    bat 'mvnw.cmd clean test'
                }

                dir('backend/api-gateway') {
                    bat 'mvnw.cmd clean test'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend/lankaassist-web') {
                    bat '''
                        @echo off
                        if exist package-lock.json (
                            call npm ci
                        ) else (
                            call npm install
                        )
                        call npm run build
                    '''
                }
            }
        }

        stage('Docker Login') {
    steps {
        withCredentials([
            usernamePassword(
                credentialsId: 'dockerhub-lankaassist-v3',
                usernameVariable: 'DOCKER_USER',
                passwordVariable: 'DOCKER_TOKEN'
            )
        ]) {
            bat '''
                @echo off
                docker logout >nul 2>&1
                powershell -NoProfile -NonInteractive -Command "$u=$env:DOCKER_USER.Trim(); $t=$env:DOCKER_TOKEN.Trim(); $t | docker login --username $u --password-stdin; exit $LASTEXITCODE"
            '''
        }
    }
}

        stage('Build Docker Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-lankaassist-v3',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
                ]) {
                    bat '''
                        @echo off
                        docker build -t %DOCKER_USER%/lankaassist-identity-service:%BUILD_NUMBER% backend/identity-service
                        docker build -t %DOCKER_USER%/lankaassist-assistance-service:%BUILD_NUMBER% backend/assistance-service
                        docker build -t %DOCKER_USER%/lankaassist-contribution-service:%BUILD_NUMBER% backend/contribution-service
                        docker build -t %DOCKER_USER%/lankaassist-coordination-service:%BUILD_NUMBER% backend/coordination-service
                        docker build -t %DOCKER_USER%/lankaassist-api-gateway:%BUILD_NUMBER% backend/api-gateway
                        docker build -t %DOCKER_USER%/lankaassist-frontend:%BUILD_NUMBER% frontend/lankaassist-web
                    '''
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-lankaassist-v3',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
                ]) {
                    bat '''
                        @echo off
                        docker push %DOCKER_USER%/lankaassist-identity-service:%BUILD_NUMBER%
                        docker push %DOCKER_USER%/lankaassist-assistance-service:%BUILD_NUMBER%
                        docker push %DOCKER_USER%/lankaassist-contribution-service:%BUILD_NUMBER%
                        docker push %DOCKER_USER%/lankaassist-coordination-service:%BUILD_NUMBER%
                        docker push %DOCKER_USER%/lankaassist-api-gateway:%BUILD_NUMBER%
                        docker push %DOCKER_USER%/lankaassist-frontend:%BUILD_NUMBER%
                    '''
                }
            }
        }
    }

    post {
        always {
            bat 'docker logout'
        }

        success {
            echo 'LankaAssist pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the first failed stage.'
        }
    }
}
