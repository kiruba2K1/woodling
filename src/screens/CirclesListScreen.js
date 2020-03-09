import React, { Component } from 'react';
import { Text, View, FlatList, Image, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { FAB } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import firebase from 'react-native-firebase';
import { apiurl } from '../constants/config';
import CirclesListComponent from '../components/CirclesListComponent';
import TextView from '../components/TextView';

const { width, height } = Dimensions.get('screen')
export class CirclesListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatlist: []
    };
  }

  componentDidMount() {
    const { user_id } = this.props;
    // if (!firebase.apps.length) {
    //   //avoid re-initializing
    //   firebase.initializeApp({
    //     apiKey: "AIzaSyCmp8DHdiGRvjXVo5VeaGU5CFHbKZob-ao",
    //     authDomain: "woodlig-5b2d4.firebaseapp.com",
    //     databaseURL: "https://woodlig-5b2d4.firebaseio.com",
    //     projectId: "woodlig-5b2d4",
    //     storageBucket: "woodlig-5b2d4.appspot.com",
    //     messagingSenderId: "393765072696",
    //     appId: "1:393765072696:web:31630a4cb41125e0b3dbcd",
    //   });
    // }
    try{
      this.newref = firebase
        .firestore()
        .collection('users')
        .doc(user_id)
        .collection('grouplist');
      const observer = this.newref.onSnapshot(docSnapshot => {
        const data = [];
        docSnapshot.forEach(element => {
          firebase
            .firestore()
            .collection('circles')
            .doc(element.data().groupkey)
            .get()
            .then(snapshot => {
              const datum = snapshot.data();
              // console.log(datum);
              data.push(datum);
              console.log(data);

              const newArray = [];
              data.forEach(obj => {
                if (!newArray.some(o => o.groupkey === obj.groupkey)) {
                  newArray.push({ ...obj })
                }
              });

              this.setState({ chatlist: newArray });
            });
        });
        console.log(data);
      });
    }catch(error){
      alert(error);
    }
    // console.log(this.newref);

    // axios
    //   .get(`${apiurl}fetch-my-circle-list.php?user_id=${user_id}`)
    //   .then(res => {
    //     console.log(res.data);
    //     this.setState({ chatlist: res.data });
    //   })
    //   .catch(res => console.log(res.data));
  }

  onSelect = (groupkey,circle_name) => {
    const { navigation } = this.props;
    navigation.navigate('GroupMessage', { groupkey, circle_name });
  };

  refreshAllData = data => {
      const { user_id } = this.props;
      try{
        this.newref = firebase
          .firestore()
          .collection('users')
          .doc(user_id)
          .collection('grouplist');
        const observer = this.newref.onSnapshot(docSnapshot => {
          const data = [];
          docSnapshot.forEach(element => {
            firebase
              .firestore()
              .collection('circles')
              .doc(element.data().groupkey)
              .get()
              .then(snapshot => {
                const datum = snapshot.data();
                // console.log(datum);
                data.push(datum);
                console.log(data);

                const newArray = [];
                data.forEach(obj => {
                  if (!newArray.some(o => o.groupkey === obj.groupkey)) {
                    newArray.push({ ...obj })
                  }
                });

                this.setState({ chatlist: newArray });
              });
          });
          console.log(data);
        });
      }catch(error){
        alert(error);
      }
  };

  componentWillUpdate() {
    console.log(this.state.chatlist)
  }

  render() {
    const { chatlist } = this.state;
    return (
      <View style={{ height, width, backgroundColor: '#eeeeee', zIndex: -100 }}>
        <FAB
          style={styles.fab}
          icon={() => (
            <FontAwesome5 name="plus" color="red" size={20} style={{ alignSelf: 'center' }} />
          )}
          onPress={() => this.props.navigation.navigate('CreateACircle',{onSelect:this.onSelect})}
        />

        <FlatList
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TextView text='Your inbox is empty' />
              <Image
                source={require('../images/EmptyChat.png')}
                style={{ width: 262, height: 192 }}
                resizeMode="contain"
              />
              <TextView text="Press the '+' button to continue chatting" />
            </View>
          }
          contentContainerStyle={{ marginTop: 20, paddingBottom: 50 }}
          style={{ backgroundColor: '#eeeeee',marginBottom:100 }}
          data={chatlist}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) =>
          <CirclesListComponent
              item={item}
              onSelect={this.refreshAllData} />}
              />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 150,
    zIndex: 50,
    // top: 450,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  }
});

const mapStateToProps = state => ({
  user_id: state.userid.id,
  profilepicture: state.profilepicture.picture
});

export default connect(mapStateToProps)(CirclesListScreen);
