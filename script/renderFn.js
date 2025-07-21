import { commentsArr } from './comments.js'
import { nl2br } from './escapeHtml.js'

export function renderComments(
    commentsList = document.querySelector('.comments'),
) {
    commentsList.innerHTML = ''
    commentsArr.forEach((comment, index) => {
        const commentElement = document.createElement('li')
        commentElement.classList.add('comment')
        commentElement.innerHTML = `
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${nl2br(comment.text)}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="like-button ${comment.liked ? '-active-like' : ''}" data-index="${index}"></button>
       </div>
        </div>`
        commentsList.appendChild(commentElement)
    })
}
