import { escapeHtml } from './escapeHtml.js'
import { commentsArr, fetchCommentsToServer } from './comments.js'
import { renderComments } from './renderFn.js'

function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}

export function addComment() {
    const addFormButton = document.querySelector('.add-form-button')
    const userName = document.querySelector('.add-form-name')
    const userComment = document.querySelector('.add-form-text')

    addFormButton.addEventListener('click', () => {
        if (userName.value.trim() === '' || userComment.value.trim() === '') {
            alert('Заполните все поля')
            return
        }
        const loader = document.createElement('li')
        loader.classList.add('loader')
        loader.innerHTML = 'Новый комментарий добавляется...'
        document.querySelector('.comments').appendChild(loader)
        const form = document.querySelector('.add-form-button')
        form.disabled = true

        fetch(
            'https://wedev-api.sky.pro/api/v1/anastasiya-veremyova/comments',
            {
                method: 'POST',
                body: JSON.stringify({
                    text: escapeHtml(userComment.value),
                    name: escapeHtml(userName.value),
                }),
            },
        )
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((error) => {
                        throw new Error(error.error)
                    })
                }
                return response.json()
            })
            .then(() => fetchCommentsToServer())
            .then(() => {
                userName.value = ''
                userComment.value = ''
                document.querySelector('.add-form-button').disabled = false
            })
            .catch((error) => {
                console.error('Ошибка при добавлении комментария:', error)
                alert('Ошибка: ' + error.message)
            })
    })
}

export function likeComment() {
    const commentsList = document.querySelector('.comments')
    commentsList.addEventListener('click', async function (event) {
        const target = event.target

        if (target.classList.contains('like-button')) {
            target.classList.add('loading')

            await delay(2000)

            const id = Number(target.dataset.id)
            const comment = commentsArr.find((comment) => comment.id === id)

            if (comment) {
                if (!comment.isLiked) {
                    comment.likes++
                } else {
                    comment.likes--
                }

                comment.isLiked = !comment.isLiked
            }

            target.classList.remove('loading')
            renderComments()
        }
    })
}

export function quoteComment() {
    const commentsList = document.querySelector('.comments')
    const userComment = document.querySelector('.add-form-text')

    commentsList.addEventListener('click', function (event) {
        if (event.target.classList.contains('comment-text')) {
            const commentEl = event.target.closest('.comment')
            const author = commentEl.querySelector(
                '.comment-header > div',
            ).textContent
            const commentText = event.target.textContent
            userComment.value = `"${commentText}"\n\nКомментарий от: ${author}\n\n`
        }
        event.stopPropagation()
    })
}
