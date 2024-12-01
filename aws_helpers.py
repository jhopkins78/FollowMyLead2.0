import boto3
import logging
from botocore.exceptions import ClientError
from flask import current_app
import os

logger = logging.getLogger(__name__)

class S3Helper:
    def __init__(self):
        self.s3 = boto3.client('s3')
        self.bucket = current_app.config['S3_BUCKET']
    
    def upload_file(self, file_obj, object_name=None, extra_args=None):
        """Upload a file to S3 bucket
        
        :param file_obj: File to upload
        :param object_name: S3 object name. If not specified, file_obj.filename is used
        :param extra_args: Optional dict of extra arguments for S3 client
        :return: True if file was uploaded, else False
        """
        if object_name is None:
            object_name = file_obj.filename
            
        # Ensure unique filename by prepending timestamp
        timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S_')
        object_name = f"{timestamp}{object_name}"
        
        try:
            if extra_args is None:
                extra_args = {}
            self.s3.upload_fileobj(file_obj, self.bucket, object_name, ExtraArgs=extra_args)
            logger.info(f"Successfully uploaded {object_name} to {self.bucket}")
            return True
        except ClientError as e:
            logger.error(f"Error uploading file to S3: {str(e)}")
            return False
    
    def download_file(self, object_name, file_path):
        """Download a file from S3 bucket
        
        :param object_name: S3 object name
        :param file_path: Local path to save the file
        :return: True if file was downloaded, else False
        """
        try:
            self.s3.download_file(self.bucket, object_name, file_path)
            logger.info(f"Successfully downloaded {object_name} from {self.bucket}")
            return True
        except ClientError as e:
            logger.error(f"Error downloading file from S3: {str(e)}")
            return False
    
    def delete_file(self, object_name):
        """Delete a file from S3 bucket
        
        :param object_name: S3 object name to delete
        :return: True if file was deleted, else False
        """
        try:
            self.s3.delete_object(Bucket=self.bucket, Key=object_name)
            logger.info(f"Successfully deleted {object_name} from {self.bucket}")
            return True
        except ClientError as e:
            logger.error(f"Error deleting file from S3: {str(e)}")
            return False
    
    def get_file_url(self, object_name, expiration=3600):
        """Generate a presigned URL for an S3 object
        
        :param object_name: S3 object name
        :param expiration: Time in seconds for the URL to remain valid
        :return: Presigned URL as string. If error, returns None
        """
        try:
            url = self.s3.generate_presigned_url('get_object',
                                               Params={'Bucket': self.bucket,
                                                      'Key': object_name},
                                               ExpiresIn=expiration)
            return url
        except ClientError as e:
            logger.error(f"Error generating presigned URL: {str(e)}")
            return None
