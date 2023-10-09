import React, { useEffect, useState } from 'react'
import Comment from './Comment'
import "../../styles/comments.css"
import { useSelector} from "react-redux";

function CommentList({commentsArray, handleReplyChange, handleNewReply, currentReply, handleDeleteComment, handleDeleteReply}) {
    return(
        <div className="comment-stack">
            {
                commentsArray?.map((comment) =>{
                    return <Comment handleDeleteReply = {handleDeleteReply} handleDeleteComment={handleDeleteComment} commentId={comment?.id} handleReplyChange={handleReplyChange} currentReply={currentReply} handleNewReply={(event) => handleNewReply(event, comment?.id)} key={comment?.id} message={comment?.commentText ? comment?.commentText : comment?.reply_text} user={comment?.user} createdAt={comment?.createdAt} replies={comment?.replies}></Comment>

                })
            }
        </div>
    )
}
export default CommentList;