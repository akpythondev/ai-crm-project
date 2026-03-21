import { useState } from "react";
import axios from "axios";

function App() {

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [suggestion, setSuggestion] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dataList, setDataList] = useState([]);

  const [form, setForm] = useState({
    doctor: "",
    date: "",
    time: "",
    attendees: "",
    topics: "",
    sentiment: "Neutral",
    outcomes: "",
    followup: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const sendChat = async () => {
    if (!msg.trim()) return;

    const userMsg = { sender: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        input: msg
      });

      const aiMsg = { sender: "ai", text: response.data.response };
      setMessages((prev) => [...prev, aiMsg]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error" }
      ]);
    }

    setMsg("");
  };

  const submitForm = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/log",
        {
          doctor_name: form.doctor,
          product: "Medicine",
          summary: form.topics
        }
      );

      alert(response.data.response);
    } catch (err) {
      console.error(err);
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/show");
      setDataList(res.data.response);
      setShowModal(true); 
    } catch (err) {
      console.error(err);
    }
  };

  const getSuggestion = async () => {
  if (!form.topics) {
      alert("Enter topics first");
      return;
    }
  const res = await axios.post("http://127.0.0.1:8000/suggest", {
       text: form.topics
    });

    setSuggestion(res.data.response);
  };

    return (
      <div className="flex p-6 bg-gray-100 min-h-screen gap-6">

        <div className="w-2/3 bg-white p-6 rounded shadow">

          <h2 className="text-xl font-semibold mb-4">
            Log HCP Interaction
          </h2>

          <input
            name="doctor"
            placeholder="HCP Name"
            onChange={handleChange}
            className="input"
          />

          <div className="flex gap-2">
            <input type="date" name="date" onChange={handleChange} className="input"/>
            <input type="time" name="time" onChange={handleChange} className="input"/>
          </div>

          <input
            name="attendees"
            placeholder="Attendees"
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="topics"
            placeholder="Topics Discussed"
            onChange={handleChange}
            className="input"
          />

          <select name="sentiment" onChange={handleChange} className="input">
            <option>Positive</option>
            <option>Neutral</option>
            <option>Negative</option>
          </select>

          <textarea
            name="outcomes"
            placeholder="Outcomes"
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="followup"
            placeholder="Follow-up Actions"
            onChange={handleChange}
            className="input"
          />

          <div className="flex gap-2 mt-3">
            <button onClick={submitForm} className="btn-blue">
              Save
            </button>

            <button onClick={getData} className="btn-green">
              Show
            </button>

            <button onClick={getSuggestion} className="btn-yellow">
              Suggest
            </button>
            {suggestion && (
              <div className="bg-gray-100 p-2 mt-2 rounded">
                {suggestion}
              </div>
            )}
          </div>
        </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded shadow w-[500px] max-h-[400px] overflow-y-auto">

            <h2 className="text-lg font-semibold mb-4">Interactions</h2>

            {dataList.length === 0 ? (
              <p>No data found</p>
            ) : (
              dataList.map((item) => (
                <div
                  key={item.id}
                  className="border p-2 mb-2 rounded flex justify-between items-center"
                >
                  <span>{item.doctor}</span>
                </div>
              ))
            )}

            <button
              onClick={() => setShowModal(false)}
              className="btn-green mt-3 w-full"
            >
              Close
            </button>

          </div>
        </div>
      )}

      

      <div className="w-1/3 bg-white p-4 rounded shadow flex flex-col">

        <h2 className="font-semibold mb-2">AI Assistant</h2>

        <div className="flex-1 overflow-y-auto mb-2 space-y-2 p-2 border rounded">

        {messages.map((m, i) => {
        const isLong = m.text.length > 120; 
        const isExpanded = expanded[i];

        return (
          <div
            key={i}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
        className={`px-3 py-2 rounded max-w-[70%] ${
          m.sender === "user"
            ? "bg-green-500 text-white"
            : "bg-gray-200"
        }`}
      >

        <div className="max-h-[120px] overflow-y-auto pr-2 text-sm leading-relaxed break-words">
          <span>
            {isLong && !isExpanded
              ? m.text.slice(0, 120) + "..."
              : m.text}
          </span>
        </div>

        {isLong && (
          <div
            className="text-xs mt-1 cursor-pointer underline"
            onClick={() =>
              setExpanded((prev) => ({
                ...prev,
                [i]: !prev[i]
              }))
            }
          >
            {isExpanded ? "Show Less" : "Read More"}
          </div>
        )}

      </div>
          </div>
        );
      })}

        </div>

        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="input"
          placeholder="Type message..."
        />

        <button onClick={sendChat} className="btn-green">
          Send
        </button>

      </div>
      </div>
    );
  }

export default App;