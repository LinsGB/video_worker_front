//@ts-nocheck
"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Home() {
  const [translatedText, setTranslatedText] = useState('')
  const [videoUrl, seVideotUrl] = useState('')
  const [duration, setDuration] = useState(0)
  const [pixelsTall, setPixelsTall] = useState(0)
  const [base64Image, setBase64Image] = useState('')
  const [text, setText] = useState()

  const originalAudioRef = useRef()
  const translatedAudioRef = useRef()

  useEffect( () => {
    axios.get( `${process.env.NEXT_PUBLIC_API_URL}saved_data`).then(resp => {
      const {data} = resp
      setTranslatedText(data.translated_text)
      seVideotUrl(data.url)
      setDuration(data.duration)
      setPixelsTall(data.pixelsTall)
      setBase64Image(data.image.base64)
      setText(data.image.text)
    })
  }, [])


  const setUrl = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}set_url`,payload).then((resp) => {
      const {data} = resp
      setTranslatedText(data.translated_text)
      seVideotUrl(data.url)
      setDuration(data.duration)
      setPixelsTall(data.pixelsTall)
      setBase64Image(data.image.base64)
      setText(data.image.text)
      if(originalAudioRef.current) {
        originalAudioRef.current.pause()
        originalAudioRef.current.currentTime = 0
        originalAudioRef.current.load()
      }
      if(translatedAudioRef.current) {
        translatedAudioRef.current.pause()
        translatedAudioRef.current.currentTime = 0
        translatedAudioRef.current.load()
      }
    })
  }

  return (
    <div class='flex justify-center'>
      <div class='space-y-8'>
      <h1 class='font-black text-3xl'>MP4 Interpreter</h1>
      <form  method="post" onSubmit={(event) => setUrl(event)}>
        <div class='flex items-center'>
          <textarea placeholder={videoUrl||''} name="url" ></textarea>
          <button class='ml-2 bg-white text-black' type="submit">Save URL</button>
        </div>  
      </form>
      <div>
        <p>Size of Video: {duration}</p>
        <p>Pixels Tall: {pixelsTall}</p>
      </div>
      <div>
        <h2 class="font-black text-xl">First Frame</h2>
        <div class='flex items-center'>
          <img class="w-90 h-60" src={`data:image/png;base64,${base64Image}`}/>
          <a href={`data:image/png;base64,${base64Image}`} download="GFG">
            <button class='ml-2 bg-white text-black'>Download</button>
          </a>
        </div>
        <p>IMAGE TEXT: {text}</p>
      </div>
      <div>
        <h2 class="font-black text-xl">Original audio</h2>
        <div class='flex items-center'>
          <audio controls ref={originalAudioRef}> <source src={`${process.env.NEXT_PUBLIC_API_URL}original_audio`} type="audio/mpeg"/></audio>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}download/original_audio`} download="original_audio.mp3">
            <button class='ml-2 bg-white text-black'>Download</button>
          </a>
        </div>
      </div>
      <div>
        <h2 class="font-black text-xl">Translated audio</h2>
        <div class='flex items-center'>
          <audio controls ref={translatedAudioRef}> <source src={`${process.env.NEXT_PUBLIC_API_URL}translated_audio`} type="audio/mpeg"/></audio>
          <a href={`${process.env.NEXT_PUBLIC_API_URL}download/translated_audio`} download="transalted_audio.mp3">
            <button class='ml-2 bg-white text-black'>Download</button>
          </a>
        </div>
        <p>{translatedText}</p>
      </div>
      </div>
    </div>
  );
}
