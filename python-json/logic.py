import json
import time
import os


def loadTasks():
    while True:
        if os.path.exists("test.json"):
            try:
                file = open('test.json')
                return json.load(file)
            except json.JSONDecodeError:
                return []
        else:
            createNewFile()


def writeTasks(tasks):
    with open('test.json', 'w') as file:
        json.dump(tasks, file, indent=4)


def createNewFile():
    tasks = {"data": {"lastclose": ""}, "tasks": {}}
    writeTasks(tasks)


def show():
    data = loadTasks()
    folder = input("Enter folder: ")
    for i in data["tasks"][folder]:
        print(i)


def add():
    while True:
        task = input("NEW TASK: ")
        folder = input("IN FOLDER: ")
        if task == ' ' * len(task) or folder == ' ' * len(folder):
            print('YOU MUST ATLEAST WRITE ONE CHARACTER')
        else:
            tasks = loadTasks()
            item = {"id": str(time.time()), "content": str(task)}
            if folder not in tasks["tasks"]:
                tasks["tasks"][folder] = []

            tasks["tasks"][folder].append(item)
            print(tasks)
            writeTasks(tasks)
            break

