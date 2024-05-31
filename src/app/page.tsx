"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Home() {
  const audioRef = useRef()

  useEffect( () => {
    axios.get('http://localhost:8000/saved_data')
  }, [])


  const setUrl = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    axios.post('http://localhost:8000/set_url',payload).then(() => {
      if(audioRef.current) {
        audioRef.current.load()
      }
    })
  }

  return (
    <div>
      <form method="post" onSubmit={(event) => setUrl(event)}>
        <textarea name="url" ></textarea>
        <button type="submit">Salver URL</button>
      </form>
        <audio controls ref={audioRef}> <source src="http://localhost:8000/original_audio" type="audio/mpeg"/></audio>
        <audio controls ref={audioRef}> <source src="http://localhost:8000/translated_audio" type="audio/mpeg"/></audio>
    </div>
  );
}
