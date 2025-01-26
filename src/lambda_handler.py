import os
from utils.process_video import process_video


def lambda_handler(event, context):
    """
    Lambda handler function: receives the event, processes the video, and saves frames to S3.
    """
    try:
        base64_video = event.get("video_base64", "")
        output_bucket = os.environ["OUTPUT_BUCKET"]

        if not base64_video:
            return {"statusCode": 400, "body": "No video provided in the request."}

        process_video(base64_video, output_bucket)

        return {
            "statusCode": 200,
            "body": "Video processed and frames saved successfully.",
        }
    except Exception as e:
        print(f"Error in lambda_handler: {e}")
        return {"statusCode": 500, "body": f"An error occurred: {str(e)}"}
