import Ball from "./Ball.js"
import Paddle from "./Paddle.js"

const ball = new Ball (document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const computerPaddle = new Paddle(document.getElementById("computer-paddle"))
const playerScoreElem = document.getElementById("player-score")
const computerScoreElem = document.getElementById("computer-score")
document.addEventListener("touchstart", handleTouchStart)
document.addEventListener("touchmove", handleTouchMove)

let touchStartY = null

function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY
}

function handleTouchMove(event) {
    if (!touchStartY) {
        return
    }

    const touchY = event.touches[0].clientY
    const deltaY = touchY - touchStartY

    // Adjust the paddle position based on deltaY
    const newPaddlePosition = playerPaddle.position + (deltaY / window.innerHeight) * 100
    playerPaddle.position = Math.min(Math.max(newPaddlePosition, 0), 100)

    touchStartY = touchY
}


let lastTime
function update(time) {
    if (lastTime != null) {
        const delta = time - lastTime
        ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()])
        computerPaddle.update(delta, ball.y)
        const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"))

        document.documentElement.style.setProperty("--hue", hue + delta * 0.01)


        if (isLose()) handleLose()
    }

    lastTime = time
    window.requestAnimationFrame(update)
}

function isLose() {
    const rect = ball.rect()
    return rect.right >= window.innerWidth || rect.left <= 0
}

function handleLose() {
    const rect = ball.rect()
    if (rect.right >= window.innerWidth) {
        playerScoreElem.textContent = parseInt(playerScoreElem.textContent) +1
    } else {
        computerScoreElem.textContent = parseInt(computerScoreElem.textContent) +1
    }

    
    ball.reset()
    computerPaddle.reset()
}

document.addEventListener("mousemove", handleMouseMove)

function handleMouseMove(event) {
    const newY = (event.clientY / window.innerHeight) * 100
    playerPaddle.position = Math.min(Math.max(newY, 0), 100)
}

window.requestAnimationFrame(update)