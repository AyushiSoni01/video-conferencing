import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      socket.emit("join-room", { email, room });

      setEmail("");
      setRoom("");
    },
    [email, room, socket],
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate],
  );

  useEffect(() => {
    socket.on("join-room", handleJoinRoom);
    return () => {
      socket.off("join-room", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-[#001a00] to-black">
      <div className="bg-[#0a0a0a] border border-green-500/40 shadow-lg shadow-green-500/20 rounded-2xl p-8 w-[320px]">
        <h2 className="text-2xl font-semibold text-green-400 text-center mb-6">
          Join Room
        </h2>

        <div>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-md bg-black border border-green-500/50 text-green-300 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <input
              type="text"
              placeholder="Enter room number"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="px-4 py-2 rounded-md bg-black border border-green-500/50 text-green-300 placeholder-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />

            <button className="mt-2 py-2 active:scale-95 hover:cursor-pointer rounded-md bg-linear-to-r from-green-400 to-green-600 text-black font-semibold hover:from-green-300 hover:to-green-500 transition duration-300 shadow-md shadow-green-500/30">
              Join
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
