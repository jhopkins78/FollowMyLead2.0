import os
import json
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
import logging
from utils.aws_secrets import get_aws_secrets

logger = logging.getLogger(__name__)

class Config:
    """Application configuration class"""
    
    def __init__(self):
        self.environment = os.getenv('FLASK_ENV', 'development')
        self.is_production = self.environment == 'production'
        
        # Load local environment variables in development
        if not self.is_production:
            load_dotenv()
            
        # Initialize AWS clients if in production
        self.ssm = None
        self.secrets = None
        if self.is_production:
            self.ssm = boto3.client('ssm')
            self.secrets = boto3.client('secretsmanager')
    
    def get_secret(self, secret_name):
        """Fetch secret from AWS Secrets Manager or environment variable"""
        if self.is_production:
            try:
                response = self.secrets.get_secret_value(SecretId=secret_name)
                if 'SecretString' in response:
                    return json.loads(response['SecretString'])
                logger.error(f"Secret {secret_name} not found in SecretString format")
                return None
            except ClientError as e:
                logger.error(f"Error fetching secret {secret_name}: {str(e)}")
                return None
        return os.getenv(secret_name)
    
    def get_parameter(self, param_name):
        """Fetch parameter from AWS Parameter Store or environment variable"""
        if self.is_production:
            try:
                response = self.ssm.get_parameter(
                    Name=param_name,
                    WithDecryption=True
                )
                return response['Parameter']['Value']
            except ClientError as e:
                logger.error(f"Error fetching parameter {param_name}: {str(e)}")
                return None
        return os.getenv(param_name)
    
    def load_aws_secrets(self):
        """Load AWS credentials and configuration from Secrets Manager"""
        try:
            # Get the secret name from environment variable or use a default
            secret_name = os.getenv('AWS_SECRET_NAME', 'followmylead/dev')
            region = os.getenv('AWS_REGION', 'us-east-1')
            
            # Retrieve secrets from AWS Secrets Manager
            secrets = get_aws_secrets(secret_name, region)
            
            # Update environment with AWS credentials
            os.environ['AWS_ACCESS_KEY_ID'] = secrets.get('AWS_ACCESS_KEY_ID')
            os.environ['AWS_SECRET_ACCESS_KEY'] = secrets.get('AWS_SECRET_ACCESS_KEY')
            os.environ['AWS_DEFAULT_REGION'] = secrets.get('AWS_DEFAULT_REGION', region)
            os.environ['S3_BUCKET'] = secrets.get('S3_BUCKET')
            
        except Exception as e:
            print(f"Error loading AWS secrets: {str(e)}")
            # Fall back to environment variables if Secrets Manager fails
            pass
    
    def load_config(self):
        """Load all configuration values"""
        # Try to load AWS secrets first
        self.load_aws_secrets()
        
        config = {
            'SECRET_KEY': self.get_secret('FLASK_SECRET_KEY'),
            'SQLALCHEMY_DATABASE_URI': self.get_secret('DATABASE_URL'),
            'AWS_ACCESS_KEY_ID': os.getenv('AWS_ACCESS_KEY_ID'),
            'AWS_SECRET_ACCESS_KEY': os.getenv('AWS_SECRET_ACCESS_KEY'),
            'AWS_DEFAULT_REGION': os.getenv('AWS_DEFAULT_REGION'),
            'S3_BUCKET': os.getenv('S3_BUCKET'),
            'DEBUG': not self.is_production,
            'TESTING': False,
            'SQLALCHEMY_TRACK_MODIFICATIONS': False,
            'SQLALCHEMY_ENGINE_OPTIONS': {
                'pool_pre_ping': True,
                'pool_recycle': 300,
                'connect_args': {
                    'sslmode': 'require'
                }
            }
        }
        
        # Validate required configuration
        missing_config = [key for key, value in config.items() 
                         if value is None and key not in ['DEBUG', 'TESTING']]
        if missing_config:
            raise ValueError(f"Missing required configuration: {', '.join(missing_config)}")
            
        return config
