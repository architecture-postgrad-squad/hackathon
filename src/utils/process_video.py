import base64
from io import BytesIO
import boto3
from moviepy import VideoFileClip
from PIL import Image

s3_client = boto3.client("s3")


def process_video(base64_video: str, output_bucket: str):
    """
    Processes a video encoded in Base64, extracts frames, and saves them to an S3 bucket.
    """
    try:
        video_data = base64.b64decode(base64_video)

        video_file = BytesIO(video_data)

        clip = VideoFileClip(video_file, audio=False)

        frame_rate = 1
        duration = int(clip.duration)

        for t in range(0, duration, frame_rate):
            frame = clip.get_frame(t)

            image_file = BytesIO()
            frame_image = Image.fromarray(frame)
            frame_image.save(image_file, format="PNG")
            image_file.seek(0)

            frame_name = f"frame_{t + 1}.png"

            s3_client.put_object(
                Bucket=output_bucket,
                Key=frame_name,
                Body=image_file.getvalue(),
                ContentType="image/png",
            )
            print(f"Uploaded frame {frame_name} to bucket {output_bucket}")

        clip.close()
    except Exception as e:
        raise RuntimeError(f"Error processing video: {e}")
