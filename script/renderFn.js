import { commentsArr } from './comments.js'
import { nl2br } from './escapeHtml.js'

export function renderComments() {
    const commentsList = document.querySelector('.comments')
    commentsList.innerHTML = ''
    commentsArr.forEach((comment) => {
        const commentElement = document.createElement('li')
        commentElement.classList.add('comment')
        commentElement.innerHTML = `
        <div class="comment-header">
          <div>${comment.author.name}</div>
            <div>${new Date(comment.date).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${nl2br(comment.text)}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button type="button" class="like-button ${comment.isLiked ? '-active-like' : ''}" data-id="${comment.id}" aria-label="Лайк"></button>
       </div>
        </div>
        `
        commentsList.appendChild(commentElement)
    })
}
