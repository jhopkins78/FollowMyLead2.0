import json
import os
import traceback
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        # Log the event and environment for debugging
        logger.info(f"Event: {json.dumps(event)}")
        logger.info(f"Database URL: {os.environ.get('DATABASE_URL', 'Not set')}")
        
        # Return test data for now
        test_data = {
            'leadSourceDistribution': {
                'Website': 30,
                'Referral': 25,
                'Social Media': 45
            },
            'conversionRates': {
                'Website': 0.15,
                'Referral': 0.25,
                'Social Media': 0.20
            },
            'engagementMetrics': {
                'averageTimeSpent': 300,  # 5 minutes
                'averagePageViews': 4.5,
                'totalVisits': {'Last 30 days': 1500}
            },
            'qualityMetrics': {
                'leadQualityDistribution': {
                    'High': 30,
                    'Medium': 45,
                    'Low': 25
                }
            }
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps(test_data)
        }
        
    except Exception as e:
        # Log the full error with traceback
        logger.error(f"Error: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            },
            'body': json.dumps({
                'error': str(e),
                'traceback': traceback.format_exc()
            })
        }
