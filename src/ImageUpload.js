import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { storage, db } from './firebase'
import firebase from 'firebase';
import './ImageUpload.css'

const ImageUpload = ({ username }) => {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState(null)
  const [progress, setProgress] = useState(0)
  
  const handleChange = (e) => {
    if(e.target.files[0]){
      setImage(e.target.files[0])
    }
  }

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progress)
      },
      (error) => {
        //error function
        console.log(error)
        alert(error.message)
      },
      () => {
        //complete function
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            //post image inside db
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imgUrl: url,
              username: username
            })
            setProgress(0)
            setCaption('')
            setImage(null)
          })
      }
    )
  }

  return (
    <div className='imageupload'>
      <progress className='imageupload__progress' value={progress} max='100' />
      <input type='text' value={caption} onChange={(e) => setCaption(e.target.value)} placeholder='Enter a caption...' />
      <input type='file' onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
