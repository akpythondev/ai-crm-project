from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from database import Base, engine
from agent import run_agent
from pydantic import BaseModel
from tools import log_interaction , get_interactions , suggest_action

app = FastAPI()

origins = [
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "AI CRM Running"}


class ChatRequest(BaseModel):
    input: str

@app.post("/chat")
def chat(req: ChatRequest):
    result = run_agent(req.input)
    return {"response": result}

class InteractionRequest(BaseModel):
    doctor_name: str
    product: str
    summary: str
    
# class EditRequest(BaseModel):
#     id: int
#     summary: str

# class DeleteRequest(BaseModel):
#     id: int

class SuggestRequest(BaseModel):
    text: str

@app.post("/log")
def log_data(req: InteractionRequest):
    res = log_interaction(req.dict())
    return {"response": res}

@app.get("/show")
def show_data():
    res = get_interactions()
    return {"response": res if res else "No data found "}

# @app.post("/delete")
# def delete_data(req: DeleteRequest):
#     res = delete_interaction(req.id)
#     return {"response": res}

# @app.post("/edit")
# def edit_data(req: EditRequest):
#     res = edit_interaction(req.id, req.summary)
#     return {"response": res}

@app.post("/suggest")
def suggest(req: SuggestRequest):
    res = suggest_action(req.text)
    return {"response": res if res else "No suggestion "}