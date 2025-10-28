import React, { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const { logout } = useContext(AuthContext);

  const fetchTodos = async () => {
    const res = await API.get("/todos");
    setTodos(res.data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await API.post("/todos", { title });
    setTitle("");
    fetchTodos();
  };

  const toggleComplete = async (id, isCompleted) => {
    await API.put(`/todos/${id}`, { isCompleted: !isCompleted });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await API.delete(`/todos/${id}`);
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between w-full max-w-lg mb-4">
        <h2 className="text-2xl font-bold">My To-Do List</h2>
        <button onClick={logout} className="text-red-500">Logout</button>
      </div>

      <form onSubmit={addTodo} className="flex w-full max-w-lg mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 border rounded-l px-3 py-2"
        />
        <button className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600">
          Add
        </button>
      </form>

      <ul className="w-full max-w-lg">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex justify-between items-center bg-white p-3 mb-2 rounded shadow"
          >
            <span
              onClick={() => toggleComplete(todo._id, todo.isCompleted)}
              className={`flex-1 cursor-pointer ${todo.isCompleted ? "line-through text-gray-500" : ""}`}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
