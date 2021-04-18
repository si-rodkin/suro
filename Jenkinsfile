pipeline {
    agent any
    stages {
        // stage('Clear') {
        //     steps {
        //         sh 'rm -rf /var/lib/jenkins/workspace/SURO/'
        //     }
        // }
        stage('Get SURO sources') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: '*/feature/JenkinsCI']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/si-rodkin/suro/']]])
            }
        }
        stage('Build SURO') {
            steps {
                sh 'cd react-ui && npm install && npm run build'
                sh 'python3 -m venv env\
                    && source env/bin/activate\
                    && pip3 install -r requirements.txt\
                    && ./manage.py collectstatic\
                    && ./manage.py makemigrations data_access\
                    && ./manage.py migrate'
            }
        }
        stage('Deploy SURO') {
            steps {
                sh './manage.py runserver 207.154.248.4:8008 &> log &'
            }
        }
    }
}