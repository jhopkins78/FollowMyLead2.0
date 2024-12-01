import boto3
import json
from botocore.exceptions import ClientError

def get_aws_secrets(secret_name: str, region_name: str = "us-east-1") -> dict:
    """
    Retrieve secrets from AWS Secrets Manager
    
    Args:
        secret_name (str): Name of the secret in AWS Secrets Manager
        region_name (str): AWS region where the secret is stored
        
    Returns:
        dict: Dictionary containing the secret key-value pairs
        
    Raises:
        ClientError: If there's an error retrieving the secret
    """
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # Handle AWS Secrets Manager exceptions
        error_code = e.response['Error']['Code']
        if error_code == 'DecryptionFailureException':
            raise Exception("Secrets Manager can't decrypt the protected secret text using the provided KMS key")
        elif error_code == 'InternalServiceErrorException':
            raise Exception("An error occurred on the server side")
        elif error_code == 'InvalidParameterException':
            raise Exception("You provided an invalid value for a parameter")
        elif error_code == 'InvalidRequestException':
            raise Exception("You provided a parameter value that is not valid for the current state of the resource")
        elif error_code == 'ResourceNotFoundException':
            raise Exception(f"Secret {secret_name} was not found")
        raise e
    else:
        # Secret was successfully retrieved
        if 'SecretString' in get_secret_value_response:
            return json.loads(get_secret_value_response['SecretString'])
        else:
            raise Exception("Secret value is not a string")
