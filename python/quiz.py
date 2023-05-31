import tkinter as tk
import requests
import json

class App:

    def __init__(self, master):
        self.master = master
        self.api_url = 'https://ai4christians.com/api/quiz.php'
        
        # Create and pack the GUI widgets
        self.question_entry = tk.Entry(master)
        self.question_entry.pack()
        self.add_button = tk.Button(master, text='Add Question', command=self.add_question)
        self.add_button.pack()
        self.get_button = tk.Button(master, text='Get Questions', command=self.get_questions)
        self.get_button.pack()
        self.listbox = tk.Listbox(master)
        self.listbox.pack()

    def get_questions(self):
        response = requests.get(self.api_url + '?action=read')
        questions = json.loads(response.text)
        self.listbox.delete(0, tk.END)  # clear the listbox
        for question in questions:
            self.listbox.insert(tk.END, question['question'])

    def add_question(self):
        question = self.question_entry.get()
        data = {
            'action': 'create',
            'question': question,
            # add other fields as necessary
        }
        response = requests.post(self.api_url, data=json.dumps(data))
        self.question_entry.delete(0, tk.END)  # clear the entry field
        self.get_questions()

root = tk.Tk()
app = App(root)
root.mainloop()
