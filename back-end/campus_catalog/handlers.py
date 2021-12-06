import requests
import os

def youtube_search_handler(search_term):
    api_key = os.getenv("GOOGLE_GEOCODE_API_KEY")
    url = ("https://youtube.googleapis.com/youtube/v3/search?"    
            f"key={api_key}&"
            "part=snippet&"
            "maxResults=5&"
            f"""q={'+'.join(search_term)}&"""
            "type=video&"
            "sort=viewCount&"
            "videoEmbeddable=true"
            )
    response = requests.get(url).json()
    video_list = response["items"]
    return video_list[0]['id']['videoId']
