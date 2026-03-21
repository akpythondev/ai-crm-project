from database import SessionLocal
from models import Interaction

def log_interaction(data):
    db = SessionLocal()
    new = Interaction(
        doctor_name=data["doctor_name"],
        product=data["product"],
        summary=data["summary"]
    )
    db.add(new)
    db.commit()
    db.close()
    return "Interaction logged "


# def edit_interaction(id, summary):
#     db = SessionLocal()
#     item = db.query(Interaction).filter(Interaction.id == id).first()
    
#     if item:
#         item.summary = summary
#         db.commit()
#         db.close()
#         return "Updated "
    
#     db.close()
#     return "Not found "


def get_interactions():
    db = SessionLocal()
    data = db.query(Interaction).all()
    
    result = [{"id": i.id, "doctor": i.doctor_name} for i in data]
    
    db.close()
    return result


# def delete_interaction(id):
#     db = SessionLocal()
#     item = db.query(Interaction).filter(Interaction.id == id).first()
    
#     if item:
#         db.delete(item)
#         db.commit()
#         db.close()
#         return "Deleted s"
    
#     db.close()
#     return "Not found "


def suggest_action(text):
    return f"Follow-up recommended for: {text}"