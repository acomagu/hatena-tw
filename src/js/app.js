'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {OAuth} from 'oauthio-web';

class TwitterService {
  constructor() {
    this.connectionPromise = new Promise((resolve, reject) => {
      OAuth.initialize('HdSpJuz86nyaKVgrmyzlcPE_gis');
      OAuth.popup('twitter')
      .then((connection) => {
        resolve(connection);
      })
    });
    this.myProfilePromise = this.connectionPromise.then((connection) =>
      connection.me()
    );
  }

  getMyTweets(args) {
    let id = null;
    let count = 10;
    if(typeof args == 'number') {
      count = args;
    } else {
      id = args.maxId || id;
      count = args.count || count;
    }

    return Promise.all([this.connectionPromise, this.myProfilePromise]).then((solvers) => {
      let connection = solvers[0];
      let myProfile = solvers[1];
      console.log(myProfile);
      console.log(connection);
      return connection.get(`1.1/statuses/user_timeline.json?screen_name=${encodeURIComponent(myProfile.alias)}&count=${encodeURIComponent(count)}${id ? '&max_id=' + encodeURIComponent(id) : ''}`);
    });
  }

  getMyTweetsInToday() {
    let myTweetsInToday = [];
    let getMoreTweets = ((id) =>
      this.getMyTweets({
        count: 10,
        maxId: id
      }).then((myTweets) =>
        myTweets.filter((myTweet, index, array) => {
          let timeTweetCreated = new Date(myTweet.created_at);
          let timeNow = new Date();
          return (
            timeTweetCreated.getYear() == timeNow.getYear()
            && timeTweetCreated.getMonth() == timeNow.getMonth()
            && timeTweetCreated.getDate() == timeNow.getDate()
          );
        })
      )
    );
    return new Promise((resolve, reject) => {
      let reguration = ((progressingArray) => {
        let id = null;
        id = (progressingArray[0] ? progressingArray[progressingArray.length - 1].id : null);
        getMoreTweets(id).then((myTweets) => {
          console.log(myTweets);
          if(myTweets.length == 10) {
            reguration(progressingArray.concat(myTweets));
          } else {
            resolve(progressingArray.concat(myTweets));
          }
        });
      });
      reguration([]);
    });
  }
}


class ButtonToAuth extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick() {
    this.props.onPushed();
    // this.props.onAuthed(new TwitterService());
    // twitterService.getMyTweetsInToday().then((tweets) => {
    //   for(let tweet of tweets) console.log(tweet.text);
    // });
  }
  render() {
    return (
      <button onClick={this.handleClick.bind(this)}>OAuth</button>
    );
  }
}

class TweetList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let elems = this.props.myTweets.map((tweet) => (
      <div className="input-group" keys={tweet}>
        <span className="input-group-addon"><input type="checkbox" /></span>
        <textarea className="form-control" rows="4">{tweet.text}</textarea>
      </div>
    ));
    return (
      <div>{elems}</div>
    );
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      twitterService: null,
      myTweets: []
    };
  }
  handlePush() {
    let twitterService = new TwitterService();
    twitterService.getMyTweetsInToday().then((tweets) => {
      this.setState({
        twitterService,
        myTweets: tweets
      });
    });
  }
  render() {
    return (
      <div className="container">
        <ButtonToAuth onPushed={this.handlePush.bind(this)} />
        <TweetList myTweets={this.state.myTweets} />
      </div>
    );
  }
}

let documentReadyPromise = new Promise((resolve, reject) => {
  if(document.readyState == 'complete') resolve();
  document.addEventListener('DOMContentLoaded', () => {
    resolve();
  });
});

documentReadyPromise.then(() => {
  ReactDOM.render(
    (
      <Page />
    ),
    document.querySelector('.react-root')
  );
});
