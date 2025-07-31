import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const  myTweetsData = JSON.parse( localStorage.getItem("twimbaData") ) || tweetsData

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
    else if(e.target.dataset.replyBtn){
        handleReplyBtnClick(e.target.dataset.replyBtn)
    }
    else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
})

function saveDataToLocalStorage(twimbaData){
    localStorage.setItem("twimbaData", JSON.stringify(twimbaData))
}
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = myTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    saveDataToLocalStorage(myTweetsData)
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = myTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    saveDataToLocalStorage(myTweetsData)
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        myTweetsData.unshift({
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
        saveDataToLocalStorage(myTweetsData)
        render()
        tweetInput.value = ''
    }

}

function handleReplyBtnClick(tweetId){
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    const targetTweetObj = myTweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    if(replyInput.value){
        targetTweetObj.replies.push({
            handle: `@TwimbaUser`,
            profilePic: `images/circle-user-solid-full.svg`,
            tweetText: replyInput.value
        })
        saveDataToLocalStorage(myTweetsData)
        render()
        replyInput.value = ''
    }
}

function handleDeleteClick(tweetId){
    const targetTweetsData = myTweetsData.filter(function(tweet){
        return !(tweet.uuid === tweetId)
    })
    saveDataToLocalStorage(targetTweetsData)
    location.reload()
}

function getFeedHtml(){
    let feedHtml = ``
    
    myTweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let TrashIconClass = 'hidden'
        
        if (tweet.handle === '@Scrimba'){
            TrashIconClass = ''
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
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

        repliesHtml += `
<div class="tweet-reply">
    <div class="tweet-inner">
        <i class="fa-solid fa-circle-user"></i>
        <textarea placeholder="Post reply" id="reply-input-${tweet.uuid}"></textarea>
    </div>
    <button class="tweet-btn" data-reply-btn="${tweet.uuid}">Reply</button>
</div>
`
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
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
                 <span class="tweet-detail ${TrashIconClass}">
                    <i class="fa-solid fa-trash"
                    data-delete="${tweet.uuid}"
                    ></i>
                    Delete
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

