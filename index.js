import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const storedTweets = localStorage.getItem('tweets')
if (storedTweets){
    tweetsData.splice(0, tweetsData.length, ...JSON.parse(storedTweets))
}

const tweetInput = document.getElementById('tweet-input')


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }

    else if (e.target.dataset.replySubmit){
        handleReplyBtnClick(e.target.dataset.replySubmit) // this line
    }

    else if (e.target.dataset.delete) {
        handleDeleteClick(e.target.dataset.delete)
    }

    else if (e.target.dataset.deleteReply) {
        handleReplyDeleteClick(e.target.dataset.deleteReply, e.target.dataset.parentTweet)
    }
    // see the target dataset here (connected to the html below)

})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    document.getElementById(`reply-area-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){

    if(tweetInput.value.trim()){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function  handleReplyBtnClick(tweetId) {
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
        })[0]
    if(replyInput.value.trim()){
        targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value,
            uuid: uuidv4()
        })
    replyInput.value = ''
    }
    render()
    document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
    document.getElementById(`reply-area-${tweetId}`).classList.remove('hidden')
}

function handleDeleteClick(tweetId) {
    const targetTweetIndex = tweetsData.findIndex(function(tweet){
        return tweet.uuid === tweetId
    })
    tweetsData.splice(targetTweetIndex, 1)

    render()
}

function handleReplyDeleteClick(replyId, parentTweetId) {
    console.log('clicked replyId:', replyId)
    tweetsData.forEach(function(tweet){
        const targetReplyIndex = tweet.replies.findIndex(function(reply){
        return reply.uuid === replyId
    })
    if (targetReplyIndex !== -1) {
        tweet.replies.splice(targetReplyIndex, 1)
        console.log('reply deleted from tweet:', tweet.uuid)
    }

    }) 

render()
document.getElementById(`replies-${parentTweetId}`).classList.remove('hidden')

}


//  review how dataset works! watch the videos again.
// experiment with it yourself. then come back.
// then review datasets and uuids.
// then, food delivery app project
// last step: delete replies
// (try it yourself based on the code from the tweets example)

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){

             let replyDeleteBtnHtml = ``
             if (reply.handle === '@Scrimba') {
            replyDeleteBtnHtml = `<i class="fa-solid fa-xmark delete-btn" 
            data-delete-reply="${reply.uuid}" 
            data-parent-tweet="${tweet.uuid}"></i>`
             }
        
                    repliesHtml+=`
        <div class="tweet-reply">
            <div class="tweet-inner">
             ${replyDeleteBtnHtml}
                <img src="${reply.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                    </div>
                </div>
        </div>
        `
            })
        }
        
        let deleteBtnHtml = ``
        if (tweet.handle === '@Scrimba') {
        deleteBtnHtml = `<i class="fa-solid fa-xmark delete-btn" data-delete="${tweet.uuid}"></i>`
        }

    


        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        ${deleteBtnHtml}
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="reply-input-area hidden" id="reply-area-${tweet.uuid}">
        <textarea class = "reply-box" id="reply-input-${tweet.uuid}" placeholder="Write a reply..."></textarea>
        <button class = "reply-submit" data-reply-submit="${tweet.uuid}">Reply</button>
    </div> 
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
` // check these lines

   })
   return feedHtml 
}

function render(){
    localStorage.setItem('tweets', JSON.stringify(tweetsData))
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

