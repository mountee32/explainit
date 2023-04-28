from chatbot import askgpt

def main():
    chat_log = None

    print("Welcome to the interactive chatbot! Type 'quit' to exit.")
    
    while True:
        question = input("You: ")
        
        if question.lower() == "quit":
            break
        
        answer, chat_log = askgpt(question, chat_log)
        print(f"Chatbot: {answer}")

if __name__ == "__main__":
    main()
