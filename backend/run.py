from gunicorn.app.base import BaseApplication
from main import app
import multiprocessing
import os

class StandaloneApplication(BaseApplication):
    def __init__(self, app, options=None):
        self.options = options or {}
        self.application = app
        super().__init__()

    def load_config(self):
        for key, value in self.options.items():
            if key in self.cfg.settings and value is not None:
                self.cfg.set(key, value)

    def load(self):
        return self.application

if __name__ == '__main__':
    options = {
        'bind': '0.0.0.0:8000',
        'workers': multiprocessing.cpu_count() * 2 + 1,
        'worker_class': 'uvicorn.workers.UvicornWorker',
        'worker_connections': 1000,
        'timeout': 120,
        'keepalive': 5,
        'max_requests': 1000,
        'max_requests_jitter': 50
    }

    StandaloneApplication(app, options).run()