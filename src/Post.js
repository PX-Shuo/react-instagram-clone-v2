import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import { db } from './firebase'
import Button from '@mui/material/Button'

import './Post.css'
import firebase from 'firebase'

const Post = ({ postId, username, caption, imgUrl, currentuser }) => {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [isFollowed, setIsFollowed] = useState(null)
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    let unsubscribe
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map(doc => doc.data()))
        })
    }
    return () => {
      unsubscribe()
    }
  }, [postId])

  useEffect(() => {
    if (currentuser) {
      const docRef = db.collection('accounts').doc(username).collection('follower')?.doc(currentuser?.displayName)
      docRef.get().then((doc) => {
        if (doc.exists) {
          setIsFollowed(true)
        } else {
          setIsFollowed(false)
        }
      })
    }
  }, [username, currentuser])

  useEffect(() => {
    const docRef = db.collection('accounts').doc(username)
    docRef.get().then((doc) => {
      if (doc.exists) {
        setAvatar(doc.data().avatar)
      }
    })
  }, [username])

  const postComment = (event) => {
    event.preventDefault()

    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      username: currentuser.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    setComment('')
  }

  const follow = () => {
    const docRef = db.collection('accounts').doc(username).collection('follower').doc(currentuser.displayName)
    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log('already followed, unfollowing...')
        db.collection('accounts')
          .doc(username)
          .collection('follower')
          .doc(currentuser.displayName)
          .delete()
          .then(() => {
            console.log('removed you from target user\'s follower list')
          })
        db.collection('accounts')
          .doc(currentuser.displayName)
          .collection('following')
          .doc(username)
          .delete()
          .then(() => {
            console.log('removed target user from your following list')
          })
        setIsFollowed(false)
      } else {
        console.log('following...')
        db.collection('accounts')
          .doc(username)
          .collection('follower')
          .doc(currentuser.displayName)
          .set({
            username: currentuser.displayName
          })

        db.collection('accounts')
          .doc(currentuser.displayName)
          .collection('following')
          .doc(username)
          .set({
            username: username
          })
        setIsFollowed(true)
      }
    })
  }

  return (
    <div className='post'>
      {/* header -> avatar + username */}
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          alt={username}
          src={avatar}
        />
        <h3>{username}</h3>
        <Button
          disabled={!currentuser?.displayName || username === currentuser?.displayName}
          onClick={() => follow()}
          variant='contained'
          sx={{
            fontSize: '10px',
            padding: '2px 7px',
            borderRadius: '20px',
            // color: 'white',
            backgroundColor: isFollowed ? 'pink' : 'lightgray',
            marginLeft: '10px',
          }}
        >
          {isFollowed ? 'Unfollow' : 'Follow'}
        </Button>
      </div>

      {/* image */}
      <img className='post__image' src={imgUrl} alt='' />

      {/* username + caption */}
      <p className='post__text'><strong>{username}</strong> {caption}</p>

      {/* comment section */}
      <div className='post__comments'>
        {comments?.map((comment, i) => (
          <p key={i}><strong>{comment.username}</strong> {comment.text}</p>
        ))}
      </div>

      {currentuser && (
        <form className='post__commentBox'>
          <input
            className='post__input'
            // disabled={!currentuser?.displayName}
            type='text'
            placeholder='Add a comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className='post__button'
            disabled={!comment}
            type='submit'
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  )
}

export default Post
