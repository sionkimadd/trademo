import firebase_admin
from firebase_admin import credentials, firestore, auth
import os

def init_firebase():
    cred_path = os.environ.get("FIREBASE_CREDENTIALS", "trademo-80680-firebase-adminsdk-fbsvc-009bfb1160.json")
    try:
        try:
            firebase_admin.get_app()
        except ValueError:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        raise Exception(f"Firebase initialization failed: {e}")

db = init_firebase() 