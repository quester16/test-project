import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { TodoType } from "../types.ts";
import { Todo } from "./Todo.tsx";

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [input, setInput] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const todoLSKey = "somekey";

  useEffect(() => {
    const LStodos = localStorage.getItem(todoLSKey);
    if (LStodos) setTodos(JSON.parse(LStodos));
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !input.trim()) return;

    setTodos((prevState) => {
      const newTodos = [
        ...prevState,
        {
          title: input,
          completed: false,
          id: uuidv4(),
        },
      ];
      localStorage.setItem(todoLSKey, JSON.stringify(newTodos));
      return newTodos;
    });

    setInput("");
  };

  const handleComplete = (id: string) => {
    setTodos((prevState) => {
      const updatedTodos = prevState.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
      localStorage.setItem(todoLSKey, JSON.stringify(updatedTodos));
      return updatedTodos;
    });
  };

  const handleFilter = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLButtonElement;
    // if (target.tagName.toLowerCase() === "button") {
    setActiveFilter(target.textContent || "all");
    // }
  };
  console.log(activeFilter);

  const handleRemove = () => {
    setTodos((prevState) => {
      const newTodos = prevState.filter((todo) => !todo.completed);
      localStorage.setItem(todoLSKey, JSON.stringify(newTodos));
      return newTodos;
    });
  };

  const itemsLeft = todos?.filter((todo) => !todo.completed).length ?? 0;
  const filteredTodos = (todos ?? []).filter((todo) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Active") return !todo.completed;
    if (activeFilter === "Completed") return todo.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>todos</h1>
      <div className="todo">
        <div className="input">
          {/* // честно говоря не понял зачем это кнопка */}
          <div className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
              imageRendering="optimizeQuality"
              fillRule="evenodd"
              clipRule="evenodd"
              viewBox="0 0 512 298.04"
            >
              <path
                fillRule="nonzero"
                fill={"#ececec"}
                d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"
              />
            </svg>
          </div>
          <div className="input_field">
            <input
              type={"text"}
              placeholder={"What needs to be done?"}
              name={"todo"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <div className="body">
          {filteredTodos?.length ? (
            filteredTodos.map((todo) => (
              <Todo key={todo.id} todo={todo} handleComplete={handleComplete} />
            ))
          ) : (
            <div className="no_todo">No todos!</div>
          )}
        </div>
        <div className="footer">
          <div>{`${itemsLeft} items left`} </div>
          <div className="active_btns" onClick={handleFilter}>
            <button className={activeFilter === "All" ? "active" : ""}>
              All
            </button>
            <button className={activeFilter === "Active" ? "active" : ""}>
              Active
            </button>
            <button className={activeFilter === "Completed" ? "active" : ""}>
              Completed
            </button>
          </div>
          <div>
            <button onClick={handleRemove}>Clear completed</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
