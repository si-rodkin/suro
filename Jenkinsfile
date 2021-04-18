pipeline {
    agent any
    stages {
        stage('Get SURO sources') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/si-rodkin/suro/']]])
            }
        }
        stage('Build SURO') {
            steps {
                echo 'TODO:'
            }
        }
        stage('Deploy SURO') {
            steps {
                echo 'TODO:'
            }
        }
    }
}