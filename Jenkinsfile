pipeline {
   agent any
   
   stages {
		stage('Build') {
			steps {
				echo 'Buliding student'
				sh '''
                    cd ./course-student
				'''
				sh '''
					npm install
				'''
				withEnv(['JENKINS_NODE_COOKIE=dontkillme']){
						sh '''
    				    npm run build
				    '''
				}
				
				echo 'Buliding teacher'
				sh '''
                    cd ../course-teacher
				'''
				sh '''
					npm install
				'''
				withEnv(['JENKINS_NODE_COOKIE=dontkillme']){
						sh '''
    				    npm run build
				    '''
				}
				
				sh '''
                    service nginx restart
				'''
			}
		}
   }	

}