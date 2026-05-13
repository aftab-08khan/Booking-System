import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddEventPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    start_datetime: "",
    end_datetime: "",
    price: "",
    capacity: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({
            title: form.title,
            description: form.description,
          
            start_datetime: form.start_datetime,
            end_datetime: form.end_datetime,
          
            price: Number(form.price),
            capacity: Number(form.capacity),
          })
      });

    if (res.ok) {
      navigate("/");
    } else {
      alert("Failed to create event");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white/10 border border-white/10 backdrop-blur-lg rounded-3xl p-8 space-y-5"
      >

        <h1 className="text-3xl font-bold">
          Create Event
        </h1>

        <input
          name="title"
          placeholder="Event Title"
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700"
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700"
        />

<input
  type="datetime-local"
  name="start_datetime"
  onChange={handleChange}
  className="w-full p-3 rounded-xl bg-slate-900 border"
/>

<input
  type="datetime-local"
  name="end_datetime"
  onChange={handleChange}
  className="w-full p-3 rounded-xl bg-slate-900 border"
/>
<input
  name="price"
  placeholder="Price"
  onChange={handleChange}
  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700"
/>
        <input
          name="capacity"
          placeholder="Capacity"
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700"
        />

        <button className="w-full bg-blue-600 py-3 rounded-xl font-medium">
          Create Event
        </button>

      </form>

    </div>
  );
}

export default AddEventPage;