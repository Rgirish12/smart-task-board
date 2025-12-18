from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uuid

app = FastAPI(title="Task Board API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- Models ---------
class Task(BaseModel):
    id: str
    title: str
    completed: bool = False
    tag: str

class TaskCreate(BaseModel):
    title: str

# --------- In-memory Storage ---------
tasks: List[Task] = []

# --------- Helper (Unique Feature) ---------
def get_task_tag(title: str) -> str:
    length = len(title.split())
    if length <= 3:
        return "Quick"
    elif length <= 6:
        return "Medium"
    return "Deep"

# --------- APIs ---------
@app.get("/tasks")
def get_tasks():
    return tasks

@app.post("/tasks")
def add_task(task: TaskCreate):
    new_task = Task(
        id=str(uuid.uuid4()),
        title=task.title,
        completed=False,
        tag=get_task_tag(task.title)
    )
    tasks.append(new_task)
    return new_task

@app.put("/tasks/{task_id}")
def toggle_task(task_id: str):
    for task in tasks:
        if task.id == task_id:
            task.completed = not task.completed
            return task
    return {"error": "Task not found"}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    global tasks
    tasks = [task for task in tasks if task.id != task_id]
    return {"message": "Task deleted"}
