export function initEventListeners(
    addFormButton,
    userName,
    userComment,
    commentsList,
    commentsArr,
    escapeHtml,
    renderComments,
) {
    addFormButton.addEventListener('click', () => {
        const date = new Date()
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString().slice(-2)} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

        if (userName.value.trim() === '' || userComment.value.trim() === '') {
            alert('Заполните все поля')
            return
        }

        commentsArr.push({
            name: escapeHtml(userName.value),
            date: formattedDate,
            text: escapeHtml(userComment.value),
            likes: 0,
            liked: false,
        })

        userName.value = ''
        userComment.value = ''
        renderComments(commentsList)
    })

    commentsList.addEventListener('click', function (event) {
        if (event.target.classList.contains('like-button')) {
            const index = event.target.dataset.index
            const comment = commentsArr[index]

            if (comment.liked) {
                comment.likes--
            } else {
                comment.likes++
            }

            comment.liked = !comment.liked

            renderComments(commentsList)
        }
    })

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
