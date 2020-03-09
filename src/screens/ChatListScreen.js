import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {FAB} from 'react-native-paper';
import axios from 'axios';
import firebase from 'react-native-firebase';
import ChatListComponent from '../components/ChatListComponent';
import {apiurl} from '../constants/config';
import TextView from '../components/TextView';

export class ChatListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatlist: [],
    };
  }

  componentWillUnmount() {
    const {user_id} = this.props;
    this.chatNotification = firebase
      .firestore()
      .collection('users')
      .doc(user_id)
      .collection('unreadMsg')
      .doc('chatMsgCount')
      .set({count: 0});
  }

  componentDidMount() {
    try {
      const {user_id} = this.props;
      this.newref = firebase
        .firestore()
        .collection('users')
        .doc(user_id)
        .collection('chatlist');
      const observer = this.newref.onSnapshot(docSnapshot => {
        const data = [];
        docSnapshot.forEach(element => {
          console.log('Element : ', element.data().user.user_id);

          this.refStatus = firebase
            .firestore()
            .collection('users')
            .doc(element.data().user.user_id);

          this.refStatus.get().then(result => {
            const data = this.state.chatlist;
            //this.setState({userStatus:result._data.user_status});
            var ori_data;
            if (result._data != undefined) {
              ori_data = {
                user: {
                  picture: element.data().user.picture,
                  name: element.data().user.name,
                  user_id: element.data().user.user_id,
                },
                text: element.data().text,
                createdAt: element.data().createdAt,
                status: result._data.user_status,
              };
            } else {
              ori_data = {
                user: {
                  picture: element.data().user.picture,
                  name: element.data().user.name,
                  user_id: element.data().user.user_id,
                },
                text: element.data().text,
                createdAt: element.data().createdAt,
                status: 'offline',
              };
            }

            // this.chatNotification = firebase
            //   .firestore()
            //   .collection("users")
            //   .doc(user_id)
            //   .collection("unreadMsg")
            //   .doc("chatMsgCount")
            //   .set({count:0});

            data.push(ori_data);
            this.setState({chatlist: data});
            console.log('Chat List : ', ori_data);
          });

          //data.push(element.data());
        });

        this.setState({chatlist: data});
      });
    } catch (error) {
      alert(error);
    }
    // axios
    //   .get(`${apiurl}fetch-chat-list.php?user_id=${user_id}`)
    //   .then(res => {
    //     console.log(res.data);
    //     this.setState({ chatlist: res.data });
    //   })
    //   .catch(res => console.log(res.data));
  }

  // componentDidUpdate() {
  //   console.log(this.state.chatlist);
  // }

  render() {
    const {chatlist} = this.state;
    if (chatlist.length !== 0) {
      return (
        <View
          style={{
            backgroundColor: '#eeeeee',
            flex: 1,
            flexDirection: 'column',
          }}>
          <FlatList
            data={chatlist}
            keyExtractor={item => item.createdAt}
            contentContainerStyle={{marginTop: 20, paddingBottom: 50}}
            style={{backgroundColor: '#eeeeee'}}
            keyExtractor={item => item.recipient_id}
            renderItem={({item}) => <ChatListComponent item={item} />}
          />

          <FAB
            style={styles.fab}
            icon={() => (
              <FontAwesome5
                name="plus"
                color="red"
                size={20}
                style={{alignSelf: 'center'}}
              />
            )}
            onPress={() =>
              this.props.navigation.navigate('ViewPeopleToMessage')
            }
          />

          <FAB
            style={styles.fab}
            icon={() => (
              <FontAwesome5
                name="plus"
                color="red"
                size={20}
                style={{alignSelf: 'center'}}
              />
            )}
            onPress={() =>
              this.props.navigation.navigate('ViewPeopleToMessage')
            }
          />
        </View>
      );
    }
    if (chatlist.length === 0) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <FAB
            style={styles.fab}
            icon={() => (
              <FontAwesome5
                name="plus"
                color="red"
                size={20}
                style={{alignSelf: 'center'}}
              />
            )}
            onPress={() =>
              this.props.navigation.navigate('ViewPeopleToMessage')
            }
          />
          <TextView text="Your inbox is empty" />
          <Image
            source={require('../images/EmptyChat.png')}
            style={{width: 262, height: 192}}
            resizeMode="contain"
          />
          <TextView text="Press the '+' button to continue chatting" />
        </View>
      );
    }
    return <ActivityIndicator />;
  }
}
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 20,
    backgroundColor: '#ffffff',
  },
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture,
});

export default connect(mapStateToProps)(ChatListScreen);
