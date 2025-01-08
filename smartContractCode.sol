// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Twitter{
    uint16 public MAX_TWEET_LENGTH=280;
    address public owner;
    
    //events
    //event for creating the tweet
    event TweetCreated(uint256 id,address author,
    string content,uint256 timestamp);
    //event for liking the tweet
    event TweetLiked(address liker,address author,uint256 id,uint256 likeCount);

    struct Tweet{
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }



    mapping(address=>Tweet[]) public tweets;

    function createTweet(string memory _tweet) public{
        //require
        require(bytes(_tweet).length <= MAX_TWEET_LENGTH,"Tweet is too long bro!");
        Tweet memory newTweet = Tweet({
            id:tweets[msg.sender].length,
            author:msg.sender,
            content:_tweet,
            timestamp:block.timestamp,
            likes:0
        });
        tweets[msg.sender].push(newTweet);
        //emitting event on tweet creation
        emit TweetCreated(newTweet.id,newTweet.author,newTweet.content,newTweet.timestamp);
    }
    //function to like the tweet
    function likeTweet(address _owner,uint _i)external{
        require(tweets[_owner][_i].id == _i,"Tweet doesn't exist");
        tweets[_owner][_i].likes+=1;
        //emitting event on like tweet
        emit TweetLiked(msg.sender,_owner,_i,tweets[_owner][_i].likes);
    }
    //function to unlike the tweet
    function unLikeTweet(address _owner,uint _i)external{
        require(tweets[_owner][_i].id == _i ,"Tweet doesn't exist");
        require(tweets[_owner][_i].likes>0,"It has 0 likes");
        tweets[_owner][_i].likes-=1;
    }

    function getTweet(address _owner,uint _i) public view returns(Tweet memory){
        return tweets[_owner][_i];
    }
    function getAllTweet(address _owner) public view returns(Tweet[] memory){
        return tweets[_owner];
    }
    
    //exercises

    //create function to change tweet length
    function changeTweetLength(uint16 newTweetLength) public onlyOwner{
        MAX_TWEET_LENGTH = newTweetLength;
    }
    //create constructor to set the owner
    constructor(){
        owner = msg.sender;
    }
    //create modifier to check for the owner
    modifier onlyOwner(){
        require(msg.sender == owner,"You are not authorized");
        _;
    }
}