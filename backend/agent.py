from langgraph.graph import StateGraph
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
import os

from tools import log_interaction, get_interactions, suggest_action


llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY")
)


from typing import TypedDict

class State(TypedDict):
    input: str
    output: str

def agent_node(state):

    user_input = state.get("input", "").lower()

    if not user_input:
        return {"output": "No input "}
    
    elif "log" in user_input:
        res = log_interaction({
            "doctor_name": "Dr. AI",
            "product": "Medicine",
            "summary": user_input
        })
        return {"output": res if res else "No input to log "}

    elif "show" in user_input:
        res = get_interactions()
        return {"output": str(res) if res else "No data found "}

    elif "suggest" in user_input:
        res = suggest_action(user_input)
        return {"output": res if res else "No suggestion available "}

    else:
        response = llm.invoke([HumanMessage(content=user_input)])
        return {"output": response.content}


graph = StateGraph(State)

graph.add_node("agent", agent_node)

graph.set_entry_point("agent")

graph.set_finish_point("agent")

app_graph = graph.compile()



def run_agent(input_text):
    print("INPUT:", input_text)

    result = app_graph.invoke({
        "input": input_text,
        "output": ""   
    })

    if not result:
        return "No response from agent "

    return result.get("output", "No output key ")