import React, { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const { logout } = useContext(AuthContext);

  const fetchTodos = async () => {
    const res = await API.get("/todos");
    const sortedTodos = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setTodos(sortedTodos);
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="mb-0">My To-Do List</h2>
              <button onClick={logout} className="btn btn-danger btn-sm">Logout</button>
            </div>
            <div className="card-body">
              <form onSubmit={addTodo} className="input-group mb-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add new task..."
                  className="form-control"
                />
                <button className="btn btn-primary" type="submit">Add Task</button>
              </form>
              <ul className="list-group">
                {todos.map((todo) => (
                  <li
                    key={todo._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={() => toggleComplete(todo._id, todo.isCompleted)}
                        id={`todo-${todo._id}`}
                      />
                      <label
                        className={`form-check-label ${todo.isCompleted ? "text-decoration-line-through text-muted" : ""}`}
                        htmlFor={`todo-${todo._id}`}
                      >
                        {todo.title}
                        <br />
                        <small className="text-muted">
                          Created: {new Date(todo.createdAt).toLocaleString()}
                        </small>
                        <br />
                        <small className="text-muted">
                          Modified: {new Date(todo.updatedAt).toLocaleString()}
                        </small>
                      </label>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
