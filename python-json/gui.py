import tkinter as tk
from tkinter import ttk
from logic import *


# functions


class NewWindow(tk.Toplevel):
    def __init__(self, title, master=None):
        super().__init__(master=master)
        self.title(title)
        self.geometry("300x200")

        window_width = 300
        window_height = 200
        position_right = int(master.winfo_x() + (master.winfo_width() / 2) - (window_width / 2))
        position_down = int(master.winfo_y() + (master.winfo_height() / 2) - (window_height / 2))

        self.geometry(f"+{position_right}+{position_down}")

        self.configure(background=top)
        for x in range(5):
            self.rowconfigure(x, weight=1)
            self.columnconfigure(x, weight=1)
        addLabel = tk.Label(self, text=f"add {title}", bg=top, fg="white")
        addLabel.grid(row=2, column=2, sticky="ew")

        entry = tk.Entry(self)
        entry.grid(row=3, column=2, sticky="ew")

        confirmBtn = tk.Button(self, text="add", command=lambda: guiAdd(entry, self, title))
        confirmBtn.grid(row=3, column=3, sticky="ew")

        entry.focus_set()
        entry.bind("<Return>", lambda event: guiAdd(entry, self, title))


def loadFolders():
    clearFolders()
    tasks = loadTasks()
    for index, i in enumerate(tasks["tasks"], start=0):
        folder = tk.Button(sidebar_Frame, text=i, bg=sidebar, fg="white", command=lambda fname=i: loadItems(fname))
        folder.grid(row=index, column=0, sticky="nsew")
    if tasks["data"]["lastclose"] != "":
        itemBtnCreate()
        loadItems(tasks["data"]["lastclose"])


def loadItems(folderName):
    clearListItems()
    titleLabel.config(text=folderName)
    itemBtnCreate()
    tasks = loadTasks()
    for index, i in enumerate(tasks["tasks"][folderName], start=0):
        listtext = tk.Checkbutton(main_Frame, bg=main, fg="white", text=i["content"])
        listtext.grid(row=index, column=5, columnspan=2, sticky="w")
        delBtnItem = ttk.Button(main_Frame, text="delete", command=lambda id=i["id"]: guiDeleteItem(folderName, id))
        delBtnItem.grid(row=index, column=7, sticky="w")
    global delBtnFolder
    delBtnFolder = tk.Button(top_Frame, text="delete folder", bg=top, fg="white",
                             command=lambda fname=folderName: guiDeleteFolder(fname))
    delBtnFolder.grid(row=2, column=10, sticky="ew")
    tasks["data"]["lastclose"] = folderName
    writeTasks(tasks)


def clearListItems():
    for i in main_Frame.winfo_children():
        i.destroy()


def clearFolders():
    for i in sidebar_Frame.winfo_children():
        i.destroy()


def guiAdd(entry, window, title):
    tasks = loadTasks()
    data = entry.get()
    entry.delete(0, 'end')
    if title == "folder":
        if title not in tasks["tasks"]:
            tasks["tasks"][data] = []
            writeTasks(tasks)
            loadFolders()
            loadItems(data)
    else:
        folder = titleLabel.cget("text")
        if folder != "Choose or create a folder":
            data = {"id": str(time.time()), "content": str(data)}
            tasks["tasks"][folder].append(data)
            writeTasks(tasks)
            loadItems(folder)
    window.destroy()


def guiDeleteItem(folder, itemId):
    data = loadTasks()
    new_tasks = [x for x in data["tasks"][folder] if x["id"] != itemId]
    data["tasks"][folder] = new_tasks
    writeTasks(data)
    loadItems(folder)


def guiDeleteFolder(folder):
    data = loadTasks()
    if folder in data["tasks"]:
        del data["tasks"][folder]
        data["data"]["lastclose"] = ""
        titleLabel.config(text="Choose or create a folder")
        writeTasks(data)
        BtnDelete()
        loadFolders()
        clearListItems()


def itemBtnCreate():
    global itembtn
    itembtn = tk.Button(top_Frame, text="add item", bg=top, fg="white")
    itembtn.bind("<Button>", lambda e: NewWindow("item", master))
    itembtn.grid(row=2, column=1, sticky="ew")


def BtnDelete():
    global itembtn
    itembtn.destroy()
    global delBtnFolder
    delBtnFolder.destroy()


master = tk.Tk()
master.title("Todolist")
master.geometry("600x400")

# colors
top = "#31004a"
sidebar = "#33007b"
main = "#4c00a4"

# widgets
# frame
top_Frame = tk.Frame(master, bg=top)
sidebar_Frame = tk.Frame(master, bg=sidebar)
main_Frame = tk.Frame(master, bg=main)

top_Frame.grid(row=0, column=0, columnspan=5, sticky="nsew")
sidebar_Frame.grid(row=1, column=0, rowspan=4, sticky="nsew")
main_Frame.grid(row=1, column=1, rowspan=4, columnspan=4, sticky="nsew")

# img
master.iconbitmap("./img/23.ico")

# label
titleLabel = ttk.Label(top_Frame, text="Choose or create a folder", foreground="white", background="black")
titleLabel.config(anchor="center")
titleLabel.grid(row=1, column=3, columnspan=2, sticky="nsew")

# buttons
folderBtn = tk.Button(top_Frame, text="add folder", bg=top, fg="white")

# button binds
folderBtn.bind("<Button>", lambda e: NewWindow("folder", master))

# button place
folderBtn.grid(row=2, column=0, sticky="ew")

# columns
for i in range(5):
    master.rowconfigure(i, weight=1)
    master.columnconfigure(i, weight=1)

for i in range(20):
    sidebar_Frame.rowconfigure(i, weight=1)
    main_Frame.rowconfigure(i, weight=1)
sidebar_Frame.columnconfigure(0, weight=1)

for i in range(12):
    top_Frame.columnconfigure(i, weight=1)
    main_Frame.columnconfigure(i, weight=1)
for i in range(3):
    top_Frame.rowconfigure(i, weight=1)

if __name__ == '__main__':
    loadFolders()
    master.mainloop()
