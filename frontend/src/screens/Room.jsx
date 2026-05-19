import React from "react";
import peer from "../service/peer";
import { useSocket } from "../context/SocketProvider";
import { useCallback, useState, useEffect } from "react";

const Room = () => {
  const socket = useSocket();
  const [email, setEmail] = useState("");
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoin = useCallback((data) => {
    const { email, id } = data;
    setEmail(email);
    console.log("User joined");
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    if (peer.peer.signalingState !== "stable") {
      console.log("Not stable, skipping call");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setMyStream(stream);

    // ✅ ADD TRACKS BEFORE OFFER
    stream.getTracks().forEach((track) => {
      peer.peer.addTrack(track, stream);
    });

    const offer = await peer.getOffer();
    socket.emit("call-user", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      setMyStream(stream);

      // ✅ ADD TRACKS BEFORE ANSWER
      stream.getTracks().forEach((track) => {
        peer.peer.addTrack(track, stream);
      });

      console.log("Incoming call", from, offer);

      const ans = await peer.getAnswer(offer);
      socket.emit("call-accepted", { to: from, ans });
    },
    [socket]
  );

  const handleCallAccepted = useCallback(
    async ({ ans }) => {
      await peer.setRemoteDescription(ans);
      console.log("Call accepted");
    },
    []
  );

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await peer.setRemoteDescription(ans);
  }, []);

  useEffect(() => {
    const handleTrack = (ev) => {
      console.log("Got tracks");
      setRemoteStream(ev.streams[0]); // ✅ FIXED
    };

    peer.peer.addEventListener("track", handleTrack);

    return () => {
      peer.peer.removeEventListener("track", handleTrack);
    };
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleUserJoin);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoFinal);

    return () => {
      socket.off("user-joined", handleUserJoin);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoFinal);
    };
  }, [
    socket,
    handleUserJoin,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncoming,
    handleNegoFinal,
  ]);

  return (
    <div>
      <h1>Room</h1>
      <h2>User joined : {email}</h2>

      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}

      {myStream && (
        <>
          <h2>My Stream</h2>
          <video
            height="200"
            width="250"
            autoPlay
            muted
            ref={(video) => {
              if (video) video.srcObject = myStream;
            }}
          />
        </>
      )}

      {remoteStream && (
        <>
          <h2>Remote Stream</h2>
          <video
            height="200"
            width="250"
            autoPlay
            ref={(video) => {
              if (video) video.srcObject = remoteStream;
            }}
          />
        </>
      )}
    </div>
  );
};

export default Room;