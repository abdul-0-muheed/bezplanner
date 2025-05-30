from celery import Celery
from llmmodel import tax_minimalization, business_guild

celery_app = Celery('tasks', broker='redis://localhost:6379/0')

@celery_app.task(bind=True)
def tax_minimalization_task(self, business_data, uid):
    try:
        result = tax_minimalization(business_data, uid)
        return result
    except Exception as e:
        self.update_state(state='FAILURE', meta={'exc': str(e)})
        raise


