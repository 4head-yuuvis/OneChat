import React, { Component } from 'react'
import Chatkit from '@pusher/chatkit-client'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import TypingIndicator from './components/TypingIndicator'
import WhosOnlineList from './components/WhosOnlineList'
const request = require('request');

class ChatScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: {},
      currentRoom: {},
      messages: [],
      usersWhoAreTyping: [],
      languageCodes: [],
      message: ''
      
    }
    this.sendMessage = this.sendMessage.bind(this)
    this.sendTypingEvent = this.sendTypingEvent.bind(this)
  }

  sendTypingEvent() {
    this.state.currentUser
      .isTypingIn({ roomId: this.state.currentRoom.id })
      .catch(error => console.error('error', error))
  }

  sendMessage(text) {
    this.state.currentUser.sendMessage({
      text,
      roomId: this.state.currentRoom.id,
    })
  }

  // async translate(
  //   str,
  //   lang
  // ) {
  //   // [START translate_quickstart]
  //   // Imports the Google Cloud client library
  //   const {Translate} = require('@google-cloud/translate');
  //   const projectId = 'onechat-1566682458777'; // Your GCP Project Id
  //   // Instantiates a client
  //   const translate = new Translate({projectId});
  
  //   // The text to translate
  //   const text = str;
  
  //   // The target language
  //   const target = lang;
  
  //   // Translates some text into Russian
  //   const [translation] = await translate.translate(text, target);
  //   return translation;
  //   console.log(`Text: ${text}`);
  //   console.log(`Translation: ${translation}`);
  // }

  createContentRequest(sourceLang, userLang, message) {
    return{
      method: 'GET',
      uri: "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
      + sourceLang + "&tl=" + userLang + "&dt=t&q=" + encodeURI(message)
    }
  }
  
  executeRequest(request_object){
    request.get(request_object, function callback(err, httpResponse, body) {
      if(err) throw err;
      else {
        console.log(httpResponse.statusCode)
        console.log(body)
      }
    })
  }

  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:31bc6e8a-6066-40aa-8b36-6e80e275cecc',
      userId: this.props.currentUsername,
      tokenProvider: new Chatkit.TokenProvider({
        url: 'http://localhost:3001/authenticate',
      }),
    })
    const userLanguage = this.props.currentLanguage
    

    // googleTranslate.getSupportedLanguages("en", function(err, languageCodes) {
    //   getLanguageCodes(languageCodes); // use a callback function to setState
    // });

    // const getLanguageCodes = languageCodes => {
    //   this.setState({ languageCodes });
    // };

    // console.log(getLanguageCodes);


    chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser })
        return currentUser.subscribeToRoom({
          roomId: 'e3df7cfc-d672-4c67-809a-b9c6d3d2756f',
          messageLimit: 100,
          hooks: {
            onMessage: message => {
              var sourceLang = 'auto';
              var simpleSearchRequest = this.createContentRequest(sourceLang, userLanguage, `"${message.text}"`)
              this.executeRequest(simpleSearchRequest)
              this.setState({
                messages: [...this.state.messages, message],
              })
            },
            onUserStartedTyping: user => {
              this.setState({
                usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name],
              })
            },
            onUserStoppedTyping: user => {
              this.setState({
                usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                  username => username !== user.name
                ),
              })
            },
            onPresenceChange: () => this.forceUpdate(),
            onUserJoined: () => this.forceUpdate(),
          },
        })
      })
      .then(currentRoom => {
        this.setState({ currentRoom })
      })
      .catch(error => console.error('error', error))
  }

  render() {
    const styles = {
      container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
      chatContainer: {
        display: 'flex',
        flex: 1,
      },
      whosOnlineListContainer: {
        width: '15%',
        padding: 20,
        backgroundColor: '#2c303b',
        color: 'white',
      },
      chatListContainer: {
        padding: 20,
        width: '85%',
        display: 'flex',
        flexDirection: 'column',
      },
    }

    return (
      <div style={styles.container}>
        <div style={styles.chatContainer}>
          <aside style={styles.whosOnlineListContainer}>
            <WhosOnlineList
              currentUser={this.state.currentUser}
              users={this.state.currentRoom.users}
            />
          </aside>
          <section style={styles.chatListContainer}>
            <MessageList
              messages={this.state.messages}
              style={styles.chatList}
            />
            <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
            <SendMessageForm
              onSubmit={this.sendMessage}
              onChange={this.sendTypingEvent}
            />
          </section>
        </div>
      </div>
    )
  }
}

export default ChatScreen
